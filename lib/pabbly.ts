/**
 * Pabbly Connect: the fulfilment hand-off.
 *
 * Analytics tells Meta and GA4 that a sale happened. This tells the automation
 * who bought, so the buyer actually receives what they paid for: the Inner
 * Circle WhatsApp invite, the joining details, the guide downloads, the row in
 * a sheet.
 *
 * It is fired from the Razorpay webhook and nowhere else, for the same reason
 * the Purchase event is: the webhook is the only place a payment is proven, and
 * UPI buyers routinely never return to the confirmation page. A browser-side
 * hand-off would silently skip most Indian buyers.
 *
 * Failure here must never fail the webhook. Razorpay retries a non-200, and a
 * retry would re-fire Meta and GA4 and double-count the sale. So this reports
 * its own success and swallows its own errors: the caller logs the result and
 * still returns 200.
 *
 * That contract is exactly why this retries IN PROCESS. Every other integration
 * on the funnel has a platform retrying behind it; this one has nobody. Razorpay
 * is deliberately told the webhook succeeded, so a single dropped POST is not
 * retried by anything, ever, and the buyer never gets the WhatsApp invite or the
 * guides they paid for. Three attempts with a short backoff, then give up and
 * report it, matching the 5-Day Pain Reset build.
 *
 * ── Why this payload carries the Meta match keys too ──────────────────────
 * Pabbly is not only fulfilment; it is the ONLY place the full, unhashed
 * record of a sale exists. Meta receives hashes and nothing descriptive, GA4
 * receives no PII at all, and Razorpay holds only what it needs to charge a
 * card. So `fbc`, `fbp`, `client_ip_address`, `client_user_agent`,
 * `external_id` and `purchase_event_id` ride along here as well: they are
 * what makes it possible to rebuild, replay or reconcile a Meta event later
 * from the sheet, without which a mis-sent conversion is unrecoverable.
 *
 * Never remove a key once Pabbly's steps map it. Removing one does not error,
 * it silently blanks a column downstream.
 */
export const pabblyReady = () => Boolean(process.env.PABBLY_WEBHOOK_URL);

export type PabblyPurchase = {
  leadId: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  countryCode: string;
  fbc: string;
  fbp: string;
  clientIp: string;
  clientUserAgent: string;
  externalId: string;
  eventSourceUrl: string;
  amountRupees: number;
  isTest: boolean;
  purchaseEventId: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  fbclid: string;
  referrer: string;
  landingUrl: string;
  /* Beyond the agreed column set, kept because existing Pabbly steps already
     map them and removing a key silently blanks a column downstream. */
  paymentId: string;
  orderId: string;
  currency: string;
  product: string;
  occupation: string;
};

/* Every key is emitted on every call, empty string where unknown. Pabbly
   builds its field mapper from the FIRST payload it sees, so a key that is
   merely absent on the first test call cannot be mapped afterwards without
   re-running the trigger: an omitted key is far more expensive here than an
   empty one. */
const s = (v: unknown) => (v == null ? '' : String(v));

/**
 * The free funnel's hand-off (2026-10-06). It posts to the SAME
 * PABBLY_WEBHOOK_URL as a purchase, with the SAME keys, so the existing field
 * mapping keeps working; the workflow tells the two apart on `event`
 * ("registration" vs "purchase") and routes them on the Pabbly side.
 *
 * Payment fields go out as empty strings and amount as 0, never omitted: see
 * the note on `s` above about Pabbly's mapper. `purchase_event_id` stays empty
 * and the registration_complete event id rides in `meta_event_id` instead, so
 * a registration can never be mistaken for a sale in the sheet.
 */
export type PabblyRegistration = Omit<
  PabblyPurchase,
  'paymentId' | 'orderId' | 'purchaseEventId' | 'amountRupees'
> & { metaEventId: string };

export function sendPabblyRegistration(
  p: PabblyRegistration,
): Promise<{ ok: boolean; status: number }> {
  return post(
    buildBody(
      {
        ...p,
        paymentId: '',
        orderId: '',
        purchaseEventId: '',
        amountRupees: 0,
      },
      'registration',
      p.metaEventId,
    ),
    `registration ${p.leadId}`,
  );
}

export function sendPabblyPurchase(
  p: PabblyPurchase,
): Promise<{ ok: boolean; status: number }> {
  return post(buildBody(p, 'purchase', ''), `purchase ${p.paymentId}`);
}

function buildBody(
  p: PabblyPurchase,
  event: 'purchase' | 'registration',
  metaEventId: string,
): string {
  return JSON.stringify({
    lead_id: s(p.leadId),
    created_at: s(p.createdAt),
    first_name: s(p.firstName),
    last_name: s(p.lastName),
    email: s(p.email),
    phone: s(p.phone),
    city: s(p.city),
    country_code: s(p.countryCode),
    fbc: s(p.fbc),
    fbp: s(p.fbp),
    client_ip_address: s(p.clientIp),
    client_user_agent: s(p.clientUserAgent),
    external_id: s(p.externalId),
    event_source_url: s(p.eventSourceUrl),
    amount: p.amountRupees,
    /* Boolean, not the string "false": a Pabbly router condition on a
       non-empty string treats "false" as true and would route live sales
       down the test branch. */
    is_test: Boolean(p.isTest),
    purchase_event_id: s(p.purchaseEventId),
    utm_source: s(p.utmSource),
    utm_medium: s(p.utmMedium),
    utm_campaign: s(p.utmCampaign),
    utm_content: s(p.utmContent),
    utm_term: s(p.utmTerm),
    fbclid: s(p.fbclid),
    referrer: s(p.referrer),
    landing_url: s(p.landingUrl),

    event,
    payment_id: s(p.paymentId),
    order_id: s(p.orderId),
    name: `${s(p.firstName)} ${s(p.lastName)}`.trim(),
    currency: s(p.currency),
    product: s(p.product),
    occupation: s(p.occupation),
    /* Added for the free funnel; empty on a purchase. Appended last so no
       existing mapping shifts. */
    meta_event_id: s(metaEventId),
  });
}

/* Built once by the caller, outside the retry loop: the body must be
   byte-identical across attempts so a workflow that dedupes on payment_id (or
   lead_id) sees one record, not three near-misses. */
async function post(
  body: string,
  ref: string,
): Promise<{ ok: boolean; status: number }> {
  const url = process.env.PABBLY_WEBHOOK_URL ?? '';
  if (!url) return { ok: false, status: 0 };

  const ATTEMPTS = 3;
  let status = 0;

  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        /* Flat keys, no nesting: Pabbly maps fields one level deep, and a
           nested object arrives as an unusable blob in the step mapper. */
        body,
        /* A hanging Pabbly must not hold the Razorpay webhook open until the
           platform kills the handler. A killed handler never returns 200, so
           Razorpay retries the whole webhook and Meta and GA4 fire twice: the
           exact double-count this route is built to avoid. */
        signal: AbortSignal.timeout(10_000),
        cache: 'no-store',
      });

      if (res.ok) {
        if (attempt > 1) {
          console.info(`[pabbly] ${ref} sent on attempt ${attempt}`);
        }
        return { ok: true, status: res.status };
      }

      status = res.status;

      /* A 4xx is a deleted or re-generated workflow URL. No number of retries
         fixes that, and each one holds the webhook open for longer. */
      if (res.status >= 400 && res.status < 500) {
        console.error(`[pabbly] workflow rejected ${ref}: ${res.status}`);
        return { ok: false, status: res.status };
      }
    } catch {
      status = 0;
    }

    if (attempt < ATTEMPTS) {
      await new Promise((resolve) => {
        setTimeout(resolve, attempt * 600);
      });
    }
  }

  /* Loud, because nothing downstream will catch this: the sale is charged, the
     buyer is waiting, and no record of them reached the sheet. */
  console.error(
    `[pabbly] ${ref} FAILED after ${ATTEMPTS} attempts (last status ${status})`,
  );
  return { ok: false, status };
}
