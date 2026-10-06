import crypto from 'crypto';

import { NextResponse } from 'next/server';

import { CHECKOUT_CONFIG, capiReady } from '@/lib/checkout-config';
import { sendCapiEvent, type Occupation } from '@/lib/meta-capi';
import { pabblyReady, sendPabblyRegistration } from '@/lib/pabbly';
import { readClientIp, readClientUserAgent } from '@/lib/request-signals';

/**
 * Free registration. The free funnel's equivalent of create-order + webhook in
 * one request, because there is no payment to wait for.
 *
 *   1. Validate the same six fields the paid checkout asked for.
 *   2. Hand the lead to Pabbly on the SAME webhook the paid funnel uses
 *      (`event: "registration"`). This is the only record of the lead, so if
 *      it fails the visitor is told to retry rather than shown a thank-you
 *      for a registration nobody received.
 *   3. Fire Meta `registration_complete` via CAPI with every match key the
 *      form gives us, plus the IP and user agent read from THIS request (it is
 *      the registrant's own browser, so they are honest here). The browser
 *      pixel fires the same event with the same event id on /thank-you, and
 *      Meta dedupes the pair.
 *   4. QualifiedLead for working professionals, exactly as the paid checkout
 *      did, so the segment signal the ads were built on is not lost.
 *
 * The Razorpay routes are untouched and still work if the paid funnel returns.
 */

const truncate = (v: unknown, max = 256) => {
  const s = v == null ? '' : String(v);
  return s.length > max ? s.slice(0, max) : s;
};

const OCCUPATIONS: Occupation[] = ['working_professional', 'homemaker'];
const EVENT_ID = /^[A-Za-z0-9_-]{8,80}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad-json' }, { status: 400 });
  }

  /* Honeypot: a field no human can see. A bot that fills it gets a success
     response and nothing else, so it learns nothing. */
  if (typeof body.website === 'string' && body.website.trim()) {
    return NextResponse.json({ ok: true, leadId: '' });
  }

  const firstName = truncate(body.firstName, 80).trim();
  const lastName = truncate(body.lastName, 80).trim();
  const email = truncate(body.email, 160).trim();
  const phone = truncate(body.phone, 20).replace(/\D/g, '');
  const city = truncate(body.city, 80).trim();
  const country = truncate(body.country, 2).trim().toLowerCase() || 'in';
  const occupation = truncate(body.occupation, 32).trim();

  if (
    !firstName ||
    !lastName ||
    !EMAIL.test(email) ||
    phone.length < 8 ||
    !city ||
    !OCCUPATIONS.includes(occupation as Occupation)
  ) {
    return NextResponse.json({ ok: false, reason: 'missing-fields' }, { status: 400 });
  }

  if (!pabblyReady()) {
    console.error('[register] PABBLY_WEBHOOK_URL not configured');
    return NextResponse.json({ ok: false, reason: 'not-configured' }, { status: 503 });
  }

  const utm = (body.utm ?? {}) as Record<string, string | undefined>;
  const leadId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const clientIp = readClientIp(req);
  const clientUserAgent = readClientUserAgent(req);
  const externalId = truncate(body.externalId, 64);
  const fbc = truncate(body.fbc);
  const fbp = truncate(body.fbp);
  /* The browser fires the pixel copy with this id, so it must come from the
     browser. Falls back to the lead id, which still dedupes a retry. */
  const eventId =
    typeof body.eventId === 'string' && EVENT_ID.test(body.eventId)
      ? body.eventId
      : leadId;
  const isTest = Boolean(CHECKOUT_CONFIG.meta.testEventCode);

  const pabbly = await sendPabblyRegistration({
    leadId,
    createdAt,
    firstName,
    lastName,
    email,
    phone,
    city,
    countryCode: country,
    fbc,
    fbp,
    clientIp,
    clientUserAgent,
    externalId,
    eventSourceUrl: CHECKOUT_CONFIG.fallbackEventSourceUrl,
    /* Only the Meta test-event code marks a registration as test. The paid
       funnel's isTestMode() also looks at the Razorpay key prefix, which says
       nothing about a free sign-up and would misroute real leads whenever the
       kept rzp keys are test keys. */
    isTest,
    utmSource: truncate(utm.source, 100),
    utmMedium: truncate(utm.medium, 100),
    utmCampaign: truncate(utm.campaign, 100),
    utmContent: truncate(utm.content, 100),
    utmTerm: truncate(utm.term, 100),
    fbclid: truncate(body.fbclid, 200),
    referrer: truncate(body.referrer, 200),
    landingUrl: truncate(body.landingUrl, 300),
    currency: CHECKOUT_CONFIG.currency,
    product: CHECKOUT_CONFIG.contentName,
    occupation,
    metaEventId: eventId,
  });

  if (!pabbly.ok) {
    return NextResponse.json({ ok: false, reason: 'handoff' }, { status: 502 });
  }

  let capi = 'skipped';
  if (capiReady()) {
    const user = {
      email,
      phone,
      firstName,
      lastName,
      country,
      city,
      externalId: externalId || undefined,
      fbc: fbc || undefined,
      fbp: fbp || undefined,
      clientIp: clientIp || undefined,
      clientUserAgent: clientUserAgent || undefined,
    };
    const common = {
      pixelId: CHECKOUT_CONFIG.meta.pixelId,
      accessToken: CHECKOUT_CONFIG.meta.accessToken,
      eventSourceUrl:
        (typeof body.eventSourceUrl === 'string' && body.eventSourceUrl) ||
        CHECKOUT_CONFIG.fallbackEventSourceUrl,
      user,
      valueRupees: 0,
      currency: CHECKOUT_CONFIG.currency,
      occupation: occupation as Occupation,
      testEventCode: CHECKOUT_CONFIG.meta.testEventCode || undefined,
    };

    const [reg] = await Promise.all([
      sendCapiEvent({ ...common, eventName: 'registration_complete', eventId }),
      occupation === 'working_professional'
        ? sendCapiEvent({
            ...common,
            eventName: 'QualifiedLead',
            eventId: crypto.createHash('sha256').update(`${eventId}|QualifiedLead`).digest('hex'),
          })
        : Promise.resolve(null),
    ]);
    capi = reg.ok ? 'sent' : 'error';
    if (!reg.ok) console.error('[register] CAPI registration_complete failed', reg.status, JSON.stringify(reg.body));
  }

  console.log(`[register] ${leadId} pabbly=${pabbly.ok} capi=${capi}`);
  return NextResponse.json({ ok: true, leadId, eventId });
}
