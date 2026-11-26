'use client';

/**
 * /checkout, the 2-Day 'Sleep Like You're 2 Again' Workshop.
 *
 * Built to the same pattern as the ankita-postpartum checkout, which is the
 * house standard for challenge funnels: header with a way back, a centred
 * masthead, then a two-column body with the form on the left and a STICKY order
 * summary on the right that collapses into a tap-to-open accordion on a phone.
 *
 * Skinned in this project's own palette rather than ankita's pink, and it
 * imports the landing page's tokens instead of redeclaring them, so the two
 * pages cannot drift apart.
 *
 * Razorpay is wired through /api/razorpay/create-order. With no keys in the
 * environment that route answers "not-configured" and the button says so
 * plainly rather than failing silently, so a half-filled .env.local never looks
 * like a broken checkout.
 */

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  ArrowLeft,
  CalendarBlank,
  Check,
  CheckCircle,
  CreditCard,
  Gift,
  Lock,
  Translate,
} from '@phosphor-icons/react/dist/ssr';

import { asset } from '../_landing/asset-version';
import {
  CALL_PRICE_RUPEES,
  EVENT_SCHEDULE,
  EVENTS,
  PRICE,
  RECORDING_PRICE_RUPEES,
  rupees,
} from '../_landing/offer';
import PaymentLogos from '@/components/PaymentLogos';
import BrandMark from '../_landing/brand-mark';
import SiteFooter from '@/components/SiteFooter';
import { collectSignals } from '@/lib/client-signals';
import {
  trackAddToCart,
  trackBeginCheckout,
  trackInitiateCheckout,
} from '@/lib/track';

import { C } from '../_landing/shared';
import { orderTypeFor, parseOrderType, priceOrder, THANK_YOU_PATH, type OrderBreakdown } from '@/lib/order';
import Bumps from './bumps';
import ThemedSelect from './themed-select';
import { BONUSES, BUMPS, LEAD_ITEM } from './included';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const RZP_SDK = 'https://checkout.razorpay.com/v1/checkout.js';

/* Loaded on demand rather than in the layout: it is ~100KB that only matters
   once someone actually presses pay. */
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${RZP_SDK}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const el = document.createElement('script');
    el.src = RZP_SDK;
    el.async = true;
    el.onload = () => resolve(true);
    el.onerror = () => resolve(false);
    document.body.appendChild(el);
  });
}

/* Dial codes carry the ISO-2 alongside them because Meta's CAPI wants the
   COUNTRY as a hashed ISO 3166-1 alpha-2 code, not a dial code. India first,
   then the places this audience actually lives. */
const COUNTRIES: { iso: string; dial: string; label: string }[] = [
  { iso: 'in', dial: '+91', label: 'India (+91)' },
  { iso: 'ae', dial: '+971', label: 'UAE (+971)' },
  { iso: 'gb', dial: '+44', label: 'UK (+44)' },
  { iso: 'us', dial: '+1', label: 'USA (+1)' },
  { iso: 'ca', dial: '+1', label: 'Canada (+1)' },
  { iso: 'au', dial: '+61', label: 'Australia (+61)' },
  { iso: 'sg', dial: '+65', label: 'Singapore (+65)' },
  { iso: 'qa', dial: '+974', label: 'Qatar (+974)' },
  { iso: 'om', dial: '+968', label: 'Oman (+968)' },
  { iso: 'kw', dial: '+965', label: 'Kuwait (+965)' },
  { iso: 'sa', dial: '+966', label: 'Saudi Arabia (+966)' },
  { iso: 'nz', dial: '+64', label: 'New Zealand (+64)' },
  { iso: 'za', dial: '+27', label: 'South Africa (+27)' },
  { iso: 'my', dial: '+60', label: 'Malaysia (+60)' },
  { iso: 'de', dial: '+49', label: 'Germany (+49)' },
];

/* The audience groups the source copy names, so every buyer has a true answer.
   The VALUE is what travels to the webhook, so keep it stable even if the label
   is reworded. Meta's closed Occupation type only carries the first two values;
   the others reach the order notes and Pabbly and are dropped from Meta. */
const OCCUPATIONS = [
  { value: 'working_professional', label: 'Working professional / Corporate leader' },
  { value: 'homemaker', label: 'Parent / Homemaker' },
  { value: 'business_owner', label: 'Business owner / Entrepreneur' },
  { value: 'retired', label: 'Senior citizen / Retired professional' },
];

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string; // ISO-2
  phone: string;
  occupation: string;
};

/* Counts a number smoothly to its new value, so the total visibly moves when
   an add-on is ticked. Reduced-motion users get the new value at once. */
function useTweened(target: number, ms = 450) {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      from.current = target;
      setShown(target);
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(a + (target - a) * eased);
      setShown(v);
      from.current = v;
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return shown;
}

export default function CheckoutPage() {
  const [f, setF] = useState<Fields>({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    country: 'in',
    phone: '',
    occupation: '',
  });
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  /* The two add-ons. Only the choice travels to the server; the server prices
     it. The total shown here uses the same pricing function. */
  const [recordings, setRecordings] = useState(false);
  const [call, setCall] = useState(false);
  const priced = priceOrder(orderTypeFor(recordings, call));
  const shownTotal = useTweened(priced.totalAmount);

  /* The mobile sticky bar hides while the in-form add-ons and pay button are
     on screen, so the buyer never sees the same controls twice. */
  const ctaZoneRef = useRef<HTMLDivElement>(null);
  const [ctaZoneVisible, setCtaZoneVisible] = useState(false);
  useEffect(() => {
    const el = ctaZoneRef.current;
    if (!el) return;
    /* The bottom 200px is where the bar itself sits. A card edge peeking out
       under the bar on load must not count as "on screen", or the bar would
       hide the moment the page opens. */
    const io = new IntersectionObserver(([e]) => setCtaZoneVisible(e.isIntersecting), {
      threshold: 0,
      rootMargin: '0px 0px -200px 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const [failed, setFailed] = useState('');

  /* Arrival at the checkout. GA4 gets begin_checkout, Meta gets AddToCart.
     Meta's InitiateCheckout deliberately does NOT fire here: it waits until the
     details are valid and the payment sheet actually opens, which is a far
     stronger buying signal than a page load and is what the ads optimise on.

     This is also the only Meta event a DIRECT arrival ever gets. Someone who
     opens /checkout from an email, a retargeting ad or a bookmark never touches
     the landing page, so without this they were invisible to Meta until the pay
     tap. Ref-guarded so StrictMode's double effect and a remount cannot inflate
     the count. */
  const arrived = useRef(false);
  useEffect(() => {
    if (arrived.current) return;
    arrived.current = true;
    trackBeginCheckout();
    trackAddToCart();
  }, []);

  const v = useMemo(() => {
    const digits = f.phone.replace(/\D/g, '');
    return {
      firstName: f.firstName.trim().length > 1,
      lastName: f.lastName.trim().length > 0,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()),
      city: f.city.trim().length > 1,
      /* The dial code is chosen from the picker, so this validates the SUBSCRIBER
         number only: 7 to 12 digits covers every country in the list without
         pulling in libphonenumber-js. India is the strict case at exactly 10. */
      phone: f.country === 'in' ? digits.length === 10 : digits.length >= 7 && digits.length <= 12,
      occupation: f.occupation !== '',
    };
  }, [f]);
  const valid =
    v.firstName && v.lastName && v.email && v.city && v.phone && v.occupation;

  const dial = COUNTRIES.find((c) => c.iso === f.country)?.dial ?? '+91';
  /* E.164 without the plus, which is what both Meta and Razorpay expect. */
  const e164 = `${dial}${f.phone}`.replace(/\D/g, '');

  const startPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setFailed('');
    if (!valid || busy) return;
    setBusy(true);

    /* Meta InitiateCheckout + GA4 add_payment_info. Fired before the sheet
       opens rather than after payment, because this is the moment intent is
       real: details are valid and the buyer is committing. */
    trackInitiateCheckout({
      email: f.email.trim(),
      phone: e164,
      firstName: f.firstName.trim(),
      lastName: f.lastName.trim(),
      city: f.city.trim(),
      country: f.country,
      occupation: f.occupation,
      recordings,
      call,
    }, priced.totalAmount);

    try {
      const sdk = await loadRazorpay();
      if (!sdk) throw new Error('sdk');

      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          firstName: f.firstName.trim(),
          lastName: f.lastName.trim(),
          email: f.email.trim(),
          phone: e164,
          city: f.city.trim(),
          country: f.country,
          occupation: f.occupation,
          recordings,
          call,
          ...collectSignals(),
        }),
      });
      const order = await res.json();

      if (!res.ok || !order?.ok) {
        setBusy(false);
        setFailed(
          order?.reason === 'not-configured'
            ? 'Payments are not switched on yet. Nothing has been charged.'
            : 'We could not start the payment. Please try again.',
        );
        return;
      }

      const rzp = new window.Razorpay!({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: 'S.T.A.R.T. Right',
        /* The client's square lockup, so the brand does not disappear at the
           one moment card details are typed. ABSOLUTE, not relative: Razorpay
           renders this inside an iframe served from its own domain, where a
           bare `/brand/...` resolves against checkout.razorpay.com and
           silently 404s into a blank tile. JPG rather than WebP: the sheet is
           third-party surface and a plain raster is the safe format there. */
        image: `${window.location.origin}${asset('/brand/start-right-square.jpg')}`,
        description: priced.type === 'workshop'
          ? "2-Day Sleep Like You're 2 Again Workshop"
          : "2-Day Sleep Like You're 2 Again Workshop + add-ons",
        prefill: {
          name: `${f.firstName.trim()} ${f.lastName.trim()}`.trim(),
          email: f.email.trim(),
          contact: e164,
        },
        theme: { color: C.plumDeep },
        modal: { ondismiss: () => setBusy(false) },
        /* Purchase is NOT fired here. The webhook owns it, so a UPI payer who
           finishes in their bank app and never returns is still counted. This
           handler only moves the buyer on. */
        handler: (r: { razorpay_payment_id: string }) => {
          /* Each order type has its own thank-you page, with the links that
             order includes. The type comes back from the server that priced
             it, not from local state. */
          const page = THANK_YOU_PATH[parseOrderType(order.orderType)];
          window.location.href = `${page}?p=${encodeURIComponent(r.razorpay_payment_id)}`;
        },
      });
      rzp.open();
    } catch {
      setBusy(false);
      setFailed('We could not start the payment. Please try again.');
    }
  };

  return (
    <main className="min-h-screen pb-44 lg:pb-0" style={{ background: C.canvasAlt }}>
      <Header />

      <section className="pb-8 pt-5 md:pb-14 md:pt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8">
          <div className="mb-5 text-center sm:mb-6 md:mb-8">
            <h1
              className="font-display font-bold text-[22px] leading-tight sm:text-[28px] md:text-[34px]"
              style={{ color: C.ink, textWrap: 'balance' } as React.CSSProperties}
            >
              Add your details to confirm your seat.
            </h1>
            <p className="mt-3 text-[13px] sm:text-[13.5px]" style={{ color: C.inkSoft }}>
              {EVENT_SCHEDULE} · Live Online
            </p>
          </div>

          {/* Form left, summary right. The summary is sticky on desktop so the
              price stays in view while the form is filled, and collapses to an
              accordion on a phone so it never pushes the fields below the fold. */}
          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(320px,380px)] lg:items-start lg:gap-10">
            <form
              id="checkout-form"
              onSubmit={startPayment}
              noValidate
              className="rounded-2xl p-6 sm:p-8"
              style={{ background: C.canvas, border: `1px solid ${C.line}` }}
            >
              <p
                className="text-[10.5px] font-bold uppercase tracking-[0.2em]"
                style={{ color: C.goldInk }}
              >
                Your details
              </p>
              <h2
                className="mt-2 font-display font-bold text-[20px] leading-snug sm:text-[22px]"
                style={{ color: C.ink }}
              >
                Where should we send your seat?
              </h2>
              <p className="mt-2 text-[12.5px] sm:text-[13px]" style={{ color: C.inkSoft }}>
                Your joining link, reminders and every bonus go to these.
              </p>

              <div className="mt-6 flex flex-col gap-4">
                {/* First and last are separate fields, not one "Full name"
                    split on a space. Splitting guesses: it gives a two-word
                    surname to the first name, and a single-word entry no last
                    name at all. Meta hashes fn and ln independently, so a bad
                    guess is a permanently worse match. */}
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="First name"
                    type="text"
                    autoComplete="given-name"
                    placeholder="First name"
                    value={f.firstName}
                    onChange={(x) => setF((s) => ({ ...s, firstName: x }))}
                    bad={touched && !v.firstName}
                  />
                  <Field
                    label="Last name"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Last name"
                    value={f.lastName}
                    onChange={(x) => setF((s) => ({ ...s, lastName: x }))}
                    bad={touched && !v.lastName}
                  />
                </div>

                <Field
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={f.email}
                  onChange={(x) => setF((s) => ({ ...s, email: x }))}
                  bad={touched && !v.email}
                />

                <Field
                  label="Town / City"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="Your town or city"
                  value={f.city}
                  onChange={(x) => setF((s) => ({ ...s, city: x }))}
                  bad={touched && !v.city}
                />

                {/* The dial code is its own control rather than something the
                    buyer types, so the number that reaches Meta and Razorpay is
                    always a clean E.164 and the country arrives as an ISO-2 we
                    can hash. */}
                <div className="block">
                  <span
                    className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: C.inkSoft }}
                  >
                    WhatsApp number
                  </span>
                  <div className="flex gap-2">
                    <ThemedSelect
                      ariaLabel="Country dialling code"
                      value={f.country}
                      onChange={(x) => setF((s) => ({ ...s, country: x }))}
                      options={COUNTRIES.map((c) => ({ value: c.iso, label: c.label }))}
                      renderValue={(o) => {
                        const c = COUNTRIES.find((x) => x.iso === o.value);
                        return c ? `${c.iso.toUpperCase()} ${c.dial}` : o.label;
                      }}
                      className="w-[124px] shrink-0"
                      listClassName="w-60"
                    />
                    <input
                      className="w-full rounded-xl px-4 py-3 text-[15px] outline-none"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="98XXX XXXXX"
                      value={f.phone}
                      onChange={(e) => setF((s) => ({ ...s, phone: e.target.value }))}
                      aria-invalid={(touched && !v.phone) || undefined}
                      style={{
                        background: C.canvasAlt,
                        color: C.ink,
                        border: `1px solid ${touched && !v.phone ? C.coralInk : C.line}`,
                      }}
                    />
                  </div>
                  <span className="mt-1.5 block text-[11.5px]" style={{ color: C.inkSoft }}>
                    Your session reminders go here.
                  </span>
                </div>

                <div className="block">
                  <span
                    className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: C.inkSoft }}
                  >
                    Which best describes you?
                  </span>
                  <ThemedSelect
                    ariaLabel="Which best describes you?"
                    value={f.occupation}
                    onChange={(x) => setF((s) => ({ ...s, occupation: x }))}
                    options={OCCUPATIONS}
                    invalid={touched && !v.occupation}
                    listClassName="w-full"
                  />
                </div>
              </div>

              <div ref={ctaZoneRef}>
              <Bumps
                recordings={recordings}
                call={call}
                onRecordings={setRecordings}
                onCall={setCall}
              />

              {touched && !valid && (
                <p className="mt-4 text-[12.5px]" style={{ color: C.coralInk }}>
                  Please complete every field: your name, a working email, your
                  town or city, a valid number and one answer below.
                </p>
              )}
              {failed && (
                <p className="mt-4 text-[12.5px]" style={{ color: C.coralInk }}>
                  {failed}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="lego-press cta-shimmer mt-7 inline-flex min-h-[58px] w-full items-center justify-center rounded-2xl px-6 text-[15.5px] font-bold disabled:opacity-60"
                style={{
                  /* The same button as every CTA on the landing page. This is
                     the one the buyer has been walking toward, so it is the
                     last place it should change appearance. */
                  background: C.gold,
                  color: C.inkBody,
                  border: `1px solid ${C.goldDeep}`,
                  ['--shimmer' as string]: 'rgba(255,255,255,0.45)',
                }}
              >
                {busy
                  ? 'Taking you to payment…'
                  : `Pay ${rupees(shownTotal)} & Reserve My Spot`}
              </button>
              </div>

              {/* The pointers that sit under the checkout CTA.
                  Dot-separated on one line, each nowrap so a narrow phone wraps
                  BETWEEN them rather than mid-phrase. */}
              <div
                className="mt-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[10.5px] sm:text-[11px]"
                style={{ color: C.inkSoft }}
              >
                <span className="inline-flex items-center gap-1 whitespace-nowrap sm:gap-1.5">
                  <Lock weight="fill" className="h-3 w-3 shrink-0" style={{ color: C.goldInk }} />
                  Razorpay Secured
                </span>
                <span aria-hidden="true">·</span>
                <span className="whitespace-nowrap">SSL Encrypted</span>
              </div>

              <p
                className="mt-5 text-center text-[12px] leading-relaxed"
                style={{ color: C.inkSoft }}
              >
                Your personal data will be used to process your order, support
                your experience, and for other purposes described in our{' '}
                <Link
                  href="/privacy-policy"
                  className="font-semibold underline"
                  style={{ color: C.goldInk }}
                >
                  privacy policy
                </Link>
                .
              </p>

              <PaymentMethods />
            </form>

            <div className="lg:sticky lg:top-8">
              <OrderSummary priced={priced} shownTotal={shownTotal} />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />

      <MobileCheckoutBar
        hidden={ctaZoneVisible}
        busy={busy}
        recordings={recordings}
        call={call}
        onRecordings={setRecordings}
        onCall={setCall}
        total={shownTotal}
      />
    </main>
  );
}

/* ── Header. A way back, and nothing else: every other link is a way to not
      pay. ──────────────────────────────────────────────────────────────── */
function Header() {
  return (
    <header
      className="px-4 py-4 sm:px-6"
      style={{ background: C.plumDeep, color: C.onDark }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <BrandMark height={46} onDark />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
          style={{ color: C.onDarkMute }}
        >
          <ArrowLeft weight="bold" className="h-3.5 w-3.5" />
          Back
        </Link>
      </div>
    </header>
  );
}

/* ── Order summary: what is being bought, the total, then the three free
      bonuses and the schedule in their own boxes, then the payment method.
      Always fully open: the bonuses are part of the reason to buy, so they
      are never folded away behind a tap. ─────────────────────────────── */
function OrderSummary({
  priced,
  shownTotal,
}: {
  priced: OrderBreakdown;
  shownTotal: number;
}) {
  return (
    <div
      className="rounded-2xl p-5 sm:p-6"
      style={{ background: C.canvas, border: `1px solid ${C.line}` }}
    >
      <span
        className="block text-[10.5px] font-bold uppercase tracking-[0.2em]"
        style={{ color: C.goldInk }}
      >
        Order summary
      </span>
      <span
        className="mt-2 block font-display font-bold text-[20px] leading-snug sm:text-[22px]"
        style={{ color: C.ink }}
      >
        The 2-Day Workshop, in full
      </span>

      {/* Lead item: the thing being bought. */}
      <div
        className="mt-5 flex items-start gap-3 rounded-2xl p-3"
        style={{ background: C.canvasAlt, border: `1px solid ${C.line}` }}
      >
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl sm:h-14 sm:w-14"
          style={{ background: C.plumDeep }}
        >
          <span
            className="font-display font-bold text-[10px] uppercase tracking-[0.16em]"
            style={{ color: C.gold }}
          >
            Live
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p
            className="text-[13.5px] font-semibold leading-snug sm:text-[14px]"
            style={{ color: C.ink }}
          >
            {LEAD_ITEM}
          </p>
          <p className="mt-0.5 text-[11px] sm:text-[11.5px]" style={{ color: C.inkSoft }}>
            {EVENT_SCHEDULE}
          </p>
        </div>
        <div
          className="shrink-0 text-right font-display font-bold text-[14px] tabular-nums sm:text-[15px]"
          style={{ color: C.ink }}
        >
          {PRICE}
        </div>
      </div>

      {/* Add-ons, only once ticked: they change the total. */}
      {(priced.recordingAmount > 0 || priced.callAmount > 0) && (
        <ul className="mt-3 space-y-2">
          {priced.recordingAmount > 0 && (
            <AddOnRow label={BUMPS.recordings.summary} amount={priced.recordingAmount} />
          )}
          {priced.callAmount > 0 && (
            <AddOnRow label={BUMPS.call.summary} amount={priced.callAmount} />
          )}
        </ul>
      )}

      {/* The ruled Total. Counts to its new value when an add-on is ticked. */}
      <div
        className="mt-4 flex items-baseline justify-between gap-3 rounded-2xl px-4 py-3.5"
        style={{ background: C.goldWash, border: `1px solid ${C.lineStrong}` }}
      >
        <span
          className="font-display font-bold text-[13px] uppercase tracking-[0.12em] sm:text-[14px] sm:tracking-[0.14em]"
          style={{ color: C.ink }}
        >
          Total
        </span>
        <div
          className="font-display font-bold text-[26px] leading-none tabular-nums sm:text-[32px]"
          style={{ color: C.goldDeep }}
        >
          {rupees(shownTotal)}
        </div>
      </div>

      {/* The three free bonuses, in their own box. */}
      <div
        className="mt-5 rounded-2xl p-4"
        style={{ background: C.goldWash, border: `1px solid ${C.goldMid}` }}
      >
        <p
          className="flex items-center gap-2 font-display font-bold text-[14.5px]"
          style={{ color: C.ink }}
        >
          <Gift weight="duotone" className="h-5 w-5" style={{ color: C.goldDeep }} />3 Free
          Bonuses Included
        </p>
        <ul className="mt-3 space-y-2.5">
          {BONUSES.map((b) => (
            <li key={b.title} className="flex items-start gap-2.5">
              <CheckCircle
                weight="fill"
                className="mt-[1px] h-[18px] w-[18px] shrink-0"
                style={{ color: C.plumDeep }}
              />
              <span
                className="flex-1 text-[13px] leading-snug sm:text-[13.5px]"
                style={{ color: C.inkBody }}
              >
                {b.title}
              </span>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{ background: C.plumDeep, color: C.gold }}
              >
                Free
              </span>
            </li>
          ))}
        </ul>
        <p
          className="mt-3 border-t pt-3 text-[12px] font-semibold"
          style={{ borderColor: C.lineStrong, color: C.goldInk }}
        >
          All three come with your seat, at no extra cost.
        </p>
      </div>

      {/* The schedule, read from the date and time variables. */}
      <div
        className="mt-4 rounded-2xl p-4"
        style={{ background: C.canvasAlt, border: `1px dashed ${C.lineStrong}` }}
      >
        <p
          className="flex items-center gap-2 font-display font-bold text-[14.5px]"
          style={{ color: C.ink }}
        >
          <CalendarBlank weight="duotone" className="h-5 w-5" style={{ color: C.goldDeep }} />
          Workshop Schedule
        </p>
        <ul className="mt-2.5 space-y-1.5 text-[13.5px]" style={{ color: C.inkBody }}>
          {EVENTS.map((e) => (
            <li key={e.day}>
              <strong style={{ color: C.ink }}>Day {e.day}</strong> – {e.date} – {e.time}
            </li>
          ))}
          <li className="flex items-center gap-1.5 pt-1" style={{ color: C.inkSoft }}>
            <Translate weight="bold" className="h-3.5 w-3.5" style={{ color: C.goldDeep }} />
            Language: Hindi &amp; English
          </li>
        </ul>
      </div>

      {/* Method */}
      <div
        className="mt-4 flex items-start gap-3 rounded-2xl p-3"
        style={{ background: C.canvasAlt, border: `1px solid ${C.line}` }}
      >
        <CreditCard weight="duotone" className="h-5 w-5 shrink-0" style={{ color: C.goldInk }} />
        <div className="text-[12.5px]">
          <p className="font-semibold" style={{ color: C.ink }}>
            UPI · Cards · NetBanking
          </p>
          <p className="mt-0.5" style={{ color: C.inkSoft }}>
            Pay securely via Razorpay.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── The mobile sticky bar: both add-ons as one-line toggles and the pay
      button, pinned to the bottom of the screen on phones only. It submits
      the same form through the form attribute, so there is one payment path.
      Hidden while the in-form add-ons and button are already on screen. ─── */
function MobileCheckoutBar({
  hidden,
  busy,
  recordings,
  call,
  onRecordings,
  onCall,
  total,
}: {
  hidden: boolean;
  busy: boolean;
  recordings: boolean;
  call: boolean;
  onRecordings: (v: boolean) => void;
  onCall: (v: boolean) => void;
  total: number;
}) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 lg:hidden ${
        hidden ? 'pointer-events-none translate-y-full' : 'translate-y-0'
      }`}
      style={{
        background: 'rgba(255,254,251,0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: `1px solid ${C.lineStrong}`,
        boxShadow: '0 -14px 34px -22px rgba(38, 48, 74, 0.5)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      aria-hidden={hidden || undefined}
    >
      <div className="mx-auto max-w-xl space-y-2 px-3 pb-3 pt-3">
        <MiniBump
          label="Add workshop recordings"
          price={RECORDING_PRICE_RUPEES}
          checked={recordings}
          onChange={onRecordings}
          tabbable={!hidden}
        />
        <MiniBump
          label="Add 1-on-1 call with Sunaina"
          price={CALL_PRICE_RUPEES}
          checked={call}
          onChange={onCall}
          tabbable={!hidden}
        />
        <button
          type="submit"
          form="checkout-form"
          disabled={busy}
          tabIndex={hidden ? -1 : undefined}
          className="lego-press cta-shimmer inline-flex min-h-[54px] w-full items-center justify-center rounded-full px-6 text-[15.5px] font-bold disabled:opacity-60"
          style={{
            background: C.gold,
            color: C.inkBody,
            border: `1px solid ${C.goldDeep}`,
            ['--shimmer' as string]: 'rgba(255,255,255,0.45)',
          }}
        >
          {busy ? 'Taking you to payment…' : `Place Your Order · ${rupees(total)}`}
        </button>
      </div>
    </div>
  );
}

function MiniBump({
  label,
  price,
  checked,
  onChange,
  tabbable,
}: {
  label: string;
  price: number;
  checked: boolean;
  onChange: (v: boolean) => void;
  tabbable: boolean;
}) {
  return (
    <label
      className="kz-mini-bump flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5"
      data-on={checked ? 'true' : 'false'}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        tabIndex={tabbable ? undefined : -1}
      />
      <span
        aria-hidden
        className="kz-bump-box grid h-5 w-5 shrink-0 place-items-center rounded-md"
        style={{
          background: checked ? C.plumDeep : C.canvas,
          border: `2px solid ${checked ? C.plumDeep : C.goldMid}`,
        }}
      >
        {checked && <Check weight="bold" className="h-3 w-3" style={{ color: C.gold }} />}
      </span>
      <span className="flex-1 text-[13.5px] font-semibold" style={{ color: C.ink }}>
        {label}
      </span>
      <span
        className="shrink-0 font-display font-bold text-[14px] tabular-nums"
        style={{ color: C.goldDeep }}
      >
        + {rupees(price)}
      </span>
    </label>
  );
}

/* ── One ticked add-on in the order summary. ─────────────────────────── */
function AddOnRow({ label, amount }: { label: string; amount: number }) {
  return (
    <li
      className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-[12.5px] sm:text-[13px]"
      style={{ background: C.goldWash, border: `1px solid ${C.lineStrong}` }}
    >
      <CheckCircle weight="fill" className="mt-[2px] h-4 w-4 shrink-0" style={{ color: C.plumDeep }} />
      <span className="flex-1 font-semibold leading-snug" style={{ color: C.ink }}>
        {label}
      </span>
      <span className="shrink-0 font-bold tabular-nums" style={{ color: C.ink }}>
        + {rupees(amount)}
      </span>
    </li>
  );
}

/* ── One field. Kept as a component so every input carries the same label
      treatment, the same error state and the same focus ring. ──────────── */
function Field({
  label,
  type,
  autoComplete,
  placeholder,
  value,
  onChange,
  bad,
  note,
}: {
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  bad: boolean;
  note?: string;
}) {
  return (
    <label className="block">
      <span
        className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[0.16em]"
        style={{ color: C.inkSoft }}
      >
        {label}
      </span>
      <input
        className="w-full rounded-xl px-4 py-3 text-[15px] outline-none"
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={bad || undefined}
        style={{
          background: C.canvasAlt,
          color: C.ink,
          border: `1px solid ${bad ? C.coralInk : C.line}`,
        }}
      />
      {note && (
        <span className="mt-1.5 block text-[11.5px]" style={{ color: C.inkSoft }}>
          {note}
        </span>
      )}
    </label>
  );
}

function PaymentMethods() {
  return (
    <div
      className="mt-6 rounded-2xl p-4"
      style={{ background: C.canvasAlt, border: `1px solid ${C.line}` }}
    >
      <p
        className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.16em]"
        style={{ color: C.inkSoft }}
      >
        100% Secure &amp; Safe Payments
      </p>
      <PaymentLogos size="full" />
    </div>
  );
}

