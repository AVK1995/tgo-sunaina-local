'use client';

/**
 * The free funnel's registration form, in a modal over the landing page.
 *
 * Ads > Landing > CTA (this modal) > /thank-you.
 *
 * It owns every CTA on the page without any of them becoming client
 * components: one capture-phase listener catches a click on any [data-cta]
 * element, cancels the navigation, fires atc_event and opens. The hero stays
 * pure server HTML.
 *
 * The fields, their order and their validation are the paid checkout's,
 * unchanged, so Pabbly receives exactly the record shape it always has.
 *
 * It also opens on arrival when the url carries ?register=1 or #register,
 * which is where the retired /checkout route now sends anyone holding an old
 * link.
 */

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CheckCircle, Lock, X } from '@phosphor-icons/react/dist/ssr';

import { collectSignals } from '@/lib/client-signals';
import {
  newEventId,
  rememberMatchKeys,
  setPendingRegistration,
} from '@/lib/pixel';
import { trackRegisterOpen } from '@/lib/track';

import { SESSION_TIMES_TZ, START_DATE } from './offer';
import { C } from './shared';

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

/* The VALUE is what travels to the webhook, so keep it stable even if the
   label is reworded. */
const OCCUPATIONS = [
  { value: 'working_professional', label: 'Working professional' },
  { value: 'homemaker', label: 'Homemaker' },
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

const EMPTY: Fields = {
  firstName: '',
  lastName: '',
  email: '',
  city: '',
  country: 'in',
  phone: '',
  occupation: '',
};

export default function RegisterModal() {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState<Fields>(EMPTY);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState('');
  const honeypot = useRef<HTMLInputElement>(null);
  const firstField = useRef<HTMLInputElement>(null);

  const openForm = useCallback(() => {
    trackRegisterOpen();
    setOpen(true);
  }, []);

  /* Every [data-cta] on the page opens the form. Capture phase, so this runs
     before next/link's own handler, which then sees defaultPrevented and
     does nothing. */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.('[data-cta]');
      if (!el) return;
      e.preventDefault();
      openForm();
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [openForm]);

  /* Deep link: /?register=1 (where /checkout now redirects) or /#register. */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get('register') === '1' || window.location.hash === '#register') {
      openForm();
    }
  }, [openForm]);

  /* Lock the page behind the modal, close on Escape, focus the first field. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => firstField.current?.focus(), 60);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
    };
  }, [open, busy]);

  const v = useMemo(() => {
    const digits = f.phone.replace(/\D/g, '');
    return {
      firstName: f.firstName.trim().length > 1,
      lastName: f.lastName.trim().length > 0,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()),
      city: f.city.trim().length > 1,
      /* Subscriber number only (the dial code is picked). India is the strict
         case at exactly 10 digits. */
      phone: f.country === 'in' ? digits.length === 10 : digits.length >= 7 && digits.length <= 12,
      occupation: f.occupation !== '',
    };
  }, [f]);
  const valid = v.firstName && v.lastName && v.email && v.city && v.phone && v.occupation;

  const dial = COUNTRIES.find((c) => c.iso === f.country)?.dial ?? '+91';
  /* E.164 without the plus, which is what Meta expects. */
  const e164 = `${dial}${f.phone}`.replace(/\D/g, '');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setFailed('');
    if (!valid || busy) return;
    setBusy(true);

    const person = {
      firstName: f.firstName.trim(),
      lastName: f.lastName.trim(),
      email: f.email.trim(),
      phone: e164,
      city: f.city.trim(),
      country: f.country,
    };
    const eventId = newEventId('reg');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...person,
          occupation: f.occupation,
          eventId,
          website: honeypot.current?.value ?? '',
          ...collectSignals(),
        }),
      });
      const out = await res.json().catch(() => ({}));

      if (!res.ok || !out?.ok) {
        setBusy(false);
        setFailed(
          out?.reason === 'not-configured'
            ? 'Registrations are not switched on yet. Please try again shortly.'
            : 'We could not complete your registration. Please try again.',
        );
        return;
      }

      /* Advanced matching for the pixel copy on /thank-you, then a FULL page
         load (not a client route change) so MetaPixel re-initialises with it. */
      rememberMatchKeys(person);
      setPendingRegistration(out.eventId || eventId, f.occupation);
      window.location.assign('/thank-you');
    } catch {
      setBusy(false);
      setFailed('We could not complete your registration. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-title"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        style={{ background: 'rgba(43,24,38,0.62)', backdropFilter: 'blur(3px)' }}
        onClick={() => !busy && setOpen(false)}
      />

      <form
        onSubmit={submit}
        noValidate
        className="relative max-h-[94dvh] w-full max-w-[520px] overflow-y-auto rounded-t-3xl p-6 sm:rounded-3xl sm:p-8"
        style={{
          background: C.canvas,
          border: `1px solid ${C.lineStrong}`,
          boxShadow: '0 30px 70px -30px rgba(88,51,79,0.6)',
          paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
        }}
      >
        <button
          type="button"
          onClick={() => !busy && setOpen(false)}
          aria-label="Close registration form"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full"
          style={{ background: C.canvasAlt, color: C.inkSoft, border: `1px solid ${C.line}` }}
        >
          <X weight="bold" className="h-4 w-4" />
        </button>

        <span
          className="inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em]"
          style={{ background: C.goldWash, color: C.goldInk }}
        >
          <CheckCircle weight="fill" className="h-3 w-3 shrink-0" />
          Free Registration
        </span>
        <h2
          id="register-title"
          className="mt-3 pr-10 font-display font-bold text-[22px] leading-snug sm:text-[24px]"
          style={{ color: C.ink }}
        >
          Reserve your free spot.
        </h2>
        <p className="mt-1.5 text-[12.5px] sm:text-[13px]" style={{ color: C.inkSoft }}>
          Starts {START_DATE} · Live on Zoom · {SESSION_TIMES_TZ}
        </p>

        {/* Honeypot. Off-screen, not display:none, so naive bots still fill it. */}
        <input
          ref={honeypot}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px opacity-0"
        />

        <div className="mt-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field
              inputRef={firstField}
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

          <label className="block">
            <span
              className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[0.16em]"
              style={{ color: C.inkSoft }}
            >
              WhatsApp number
            </span>
            <div className="flex gap-2">
              <select
                className="w-[124px] shrink-0 rounded-xl px-3 py-3 text-[15px] outline-none"
                autoComplete="tel-country-code"
                aria-label="Country dialling code"
                value={f.country}
                onChange={(e) => setF((s) => ({ ...s, country: e.target.value }))}
                style={{ background: C.canvasAlt, color: C.ink, border: `1px solid ${C.line}` }}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.iso} value={c.iso}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                className="w-full min-w-0 rounded-xl px-4 py-3 text-[15px] outline-none"
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
          </label>

          <label className="block">
            <span
              className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[0.16em]"
              style={{ color: C.inkSoft }}
            >
              Are you a working professional or a homemaker?
            </span>
            <select
              className="w-full rounded-xl px-4 py-3 text-[15px] outline-none"
              value={f.occupation}
              onChange={(e) => setF((s) => ({ ...s, occupation: e.target.value }))}
              aria-invalid={(touched && !v.occupation) || undefined}
              style={{
                background: C.canvasAlt,
                color: f.occupation ? C.ink : C.inkSoft,
                border: `1px solid ${touched && !v.occupation ? C.coralInk : C.line}`,
              }}
            >
              <option value="" disabled>
                Select one
              </option>
              {OCCUPATIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {touched && !valid && (
          <p className="mt-4 text-[12.5px]" style={{ color: C.coralInk }}>
            Please complete every field: your name, a working email, your town or
            city, a valid number and one answer above.
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
          className="lego-press cta-shimmer mt-6 inline-flex min-h-[58px] w-full items-center justify-center rounded-2xl px-6 text-[15.5px] font-bold disabled:opacity-60"
          style={{
            background: C.gold,
            color: C.inkBody,
            border: `1px solid ${C.goldDeep}`,
            ['--shimmer' as string]: 'rgba(255,255,255,0.45)',
          }}
        >
          {busy ? 'Reserving your spot…' : 'Complete My Free Registration'}
        </button>

        <p
          className="mt-4 flex items-center justify-center gap-1.5 text-[11px]"
          style={{ color: C.inkSoft }}
        >
          <Lock weight="fill" className="h-3 w-3 shrink-0" style={{ color: C.goldInk }} />
          100% Free · No payment required
        </p>

        <p className="mt-3 text-center text-[11.5px] leading-relaxed" style={{ color: C.inkSoft }}>
          Your details are used to send your joining info and reminders, as
          described in our{' '}
          <Link href="/privacy-policy" className="font-semibold underline" style={{ color: C.goldInk }}>
            privacy policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  type,
  autoComplete,
  placeholder,
  value,
  onChange,
  bad,
  inputRef,
}: {
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  bad: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <label className="block min-w-0">
      <span
        className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[0.16em]"
        style={{ color: C.inkSoft }}
      >
        {label}
      </span>
      <input
        ref={inputRef}
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
    </label>
  );
}
