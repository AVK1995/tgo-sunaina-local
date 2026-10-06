'use client';

/**
 * /thank-you, where a completed FREE registration lands (2026-10-06; it was
 * the post-payment page on the paid funnel).
 *
 * Copy and section order follow the ankita-postpartum thank-you page, which is
 * the house standard: confirmation, then the WhatsApp join as the ONE next
 * step, then what arrives inside, be early, the policy, prep. Skinned to this
 * project's tokens.
 *
 * The page is built around the community join, not around the receipt. That is
 * the point of the design: the Zoom links live in the group, so a buyer who
 * never joins is a refund waiting to happen. Everything else on the page is
 * subordinate to that one button.
 *
 * On THIS funnel the group is also a paid line item, "The S.T.A.R.T. Right
 * Inner Circle" at ₹997 of the stated value, so the join button is delivering
 * a product rather than only routing the buyer.
 *
 * Wording is adapted only where ankita's is factually about a different
 * product: physiotherapist becomes coach-led, postpartum recovery becomes the
 * morning reset. The structure and the promises are unchanged.
 */

import { Suspense, useEffect } from 'react';

import {
  ArrowRight,
  CalendarBlank,
  ChatCircleDots,
  Check,
  CheckCircle,
  Clock,
  Confetti,
  Heart,
  Megaphone,
  Notebook,
  Person,
  ShieldCheck,
  Warning,
  WhatsappLogo,
  X,
} from '@phosphor-icons/react/dist/ssr';

import { SESSION_TIMES_TZ, START_DATE, WHATSAPP_INVITE } from '../_landing/offer';
import BrandMark from '../_landing/brand-mark';
import SiteFooter from '@/components/SiteFooter';
import { C } from '../_landing/shared';
import { takePendingRegistration } from '@/lib/pixel';
import { trackRegistrationComplete } from '@/lib/track';

/* WhatsApp's own brand colours. These deliberately do NOT come from the page
   palette: the community button is the same green on every funnel we ship, so
   a buyer recognises what it opens before reading the label. */
const WA = { green: '#25D366', deep: '#128C7E' } as const;

/* Semantic, not brand: green means good and amber means caution on every page
   we ship, so they stay these values rather than following the palette. */
const GOOD_GREEN = '#059669';
const WARN_AMBER = '#D97706';

const COMMUNITY_BENEFITS: { icon: typeof CheckCircle; text: string }[] = [
  { icon: ChatCircleDots, text: 'Daily Zoom session links' },
  { icon: Megaphone, text: 'Session reminders before class' },
  { icon: Notebook, text: 'Instructions for each day' },
  { icon: Heart, text: 'Support across the 5 mornings' },
  { icon: Person, text: 'Important updates from Sunaina' },
];

const POLICY_ITEMS = [
  'No rescheduling to future batches',
  'Seats are limited, so join on time',
  'Recordings are not guaranteed',
];

const PREP_ITEMS = [
  'Wear comfortable clothes for movement',
  'Keep a yoga mat or soft surface ready',
  'Be in a distraction-free space',
  'Join the community immediately',
];

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYou />
    </Suspense>
  );
}

function ThankYou() {
  /* Free funnel: the browser copy of registration_complete, with the event id
     /api/register already sent to CAPI, so Meta merges the two. Only fires
     when the modal handed off a fresh registration: a refresh or a direct
     visit finds nothing pending and sends nothing. */
  useEffect(() => {
    const pending = takePendingRegistration();
    if (pending) trackRegistrationComplete(pending.eventId);
  }, []);

  return (
    <main style={{ background: C.canvasAlt }}>
      {/* ── Masthead ─────────────────────────────────────────────────────
          The mark and nothing else. A buyer arrives here from a payment sheet
          or from an emailed link, and this is often the first surface that
          carries the brand at any size. No nav and no way back: the next step
          is the Inner Circle button below, not a return to the sales page. */}
      <header className="px-4 py-5 sm:px-6" style={{ background: C.plumDeep }}>
        <div className="mx-auto flex max-w-6xl justify-center sm:justify-start">
          <BrandMark height={46} onDark />
        </div>
      </header>

      {/* ── Confirmation ─────────────────────────────────────────────── */}
      <section className="px-5 pb-14 pt-12 text-center md:pb-20 md:pt-20">
        <div className="mx-auto max-w-3xl">
          <span
            className="mx-auto grid h-20 w-20 place-items-center rounded-full"
            style={{ background: C.goldWash, border: `1px solid ${C.lineStrong}` }}
          >
            <Confetti weight="duotone" className="h-10 w-10" style={{ color: C.goldInk }} />
          </span>

          <span
            className="mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ background: C.goldWash, color: C.goldInk }}
          >
            <Check weight="bold" className="h-3 w-3" />
            Congrats!
          </span>

          <h1
            className="mt-5 font-display font-bold text-[30px] leading-[1.05] tracking-tight sm:text-[44px] lg:text-[52px]"
            style={{ color: C.ink, textWrap: 'balance' } as React.CSSProperties}
          >
            Your 5-Day Morning Reset is{' '}
            <span style={{ color: C.goldDeep }}>Confirmed.</span>
          </h1>

          <p
            className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed sm:text-[17px]"
            style={{ color: C.inkSoft }}
          >
            You are officially enrolled in the{' '}
            <strong style={{ color: C.ink }}>
              5-Day &lsquo;Start Your Morning Right&rsquo; Challenge.
            </strong>{' '}
            Please read this page carefully: your access depends on the next
            step.
          </p>

          <div className="mx-auto mt-8 grid max-w-lg gap-3 sm:grid-cols-2">
            <DetailCard icon={CalendarBlank} label="Challenge date" value={START_DATE} />
            <DetailCard
              icon={Clock}
              label="Live session timings"
              value={SESSION_TIMES_TZ}
              footnote="One live session every morning"
            />
          </div>
        </div>
      </section>

      {/* ── The one next step ────────────────────────────────────────── */}
      <section className="px-5 pb-4 md:px-8">
        <div
          className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl p-8 text-center text-white md:p-10"
          style={{ background: `linear-gradient(135deg, ${WA.deep}, ${WA.green})` }}
        >
          <span
            aria-hidden
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0 2px, transparent 2px 22px)',
            }}
          />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em]">
              <Warning weight="fill" className="h-3 w-3" />
              Important · Step 1 of 1
            </span>

            <h2 className="mt-4 font-display font-bold text-[24px] leading-tight sm:text-[34px]">
              Join the S.T.A.R.T. Right Inner Circle now.
            </h2>

            <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-white/90">
              All updates, Zoom links, reminders and daily instructions will be
              shared inside the Inner Circle on WhatsApp.{' '}
              <strong className="text-white">
                Your access to the challenge depends on joining this group.
              </strong>
            </p>

            {WHATSAPP_INVITE ? (
              <a
                href={WHATSAPP_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-7 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-display font-bold text-[15px] "
                style={{ color: WA.deep }}
              >
                <WhatsappLogo weight="fill" className="h-5 w-5" />
                Join the Community Here
                <ArrowRight
                  weight="bold"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
            ) : (
              /* Never a dead button to someone who has just paid. */
              <p className="mt-7 text-[13.5px] font-semibold text-white">
                Your invite link is on its way by email. Check your inbox in the
                next few minutes.
              </p>
            )}

            <p className="mt-4 text-[11.5px] text-white/80">
              Opens in WhatsApp · 1-click join
            </p>
          </div>
        </div>
      </section>

      {/* ── What arrives inside ──────────────────────────────────────── */}
      <section className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionEyebrow text="What you'll receive inside" />
            <h2
              className="mt-3 font-display font-bold text-[24px] leading-tight sm:text-[32px]"
              style={{ color: C.ink }}
            >
              What you&rsquo;ll receive in the{' '}
              <span style={{ color: C.goldDeep }}>Inner Circle.</span>
            </h2>
          </div>

          <ul className="mt-10 space-y-3">
            {COMMUNITY_BENEFITS.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-4 rounded-2xl p-4"
                style={{ background: C.canvas, border: `1px solid ${C.line}` }}
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                  style={{ background: C.goldPale }}
                >
                  <Icon weight="duotone" className="h-5 w-5" style={{ color: C.goldInk }} />
                </span>
                <span className="text-[14.5px] font-medium" style={{ color: C.inkSoft }}>
                  {text}
                </span>
                <CheckCircle
                  weight="fill"
                  className="ml-auto h-5 w-5 shrink-0"
                  style={{ color: GOOD_GREEN }}
                />
              </li>
            ))}
          </ul>

          <p
            className="mt-6 rounded-xl p-4 text-center text-[13.5px] font-medium"
            style={{ background: '#FEF3C7', color: WARN_AMBER, border: '1px solid #FDE68A' }}
          >
            <Warning weight="fill" className="mr-1.5 inline-block h-4 w-4 align-text-bottom" />
            Please do <strong>not mute</strong> or{' '}
            <strong>exit the community</strong> during these <strong>5 days</strong>.
          </p>
        </div>
      </section>

      {/* ── Be available 5 min before ────────────────────────────────── */}
      <section className="px-5 pb-4 md:px-8">
        <div
          className="mx-auto max-w-3xl rounded-3xl p-7 md:p-9"
          style={{ background: C.canvas, border: `1px solid ${C.line}` }}
        >
          <div className="flex items-start gap-4">
            <span
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
              style={{ background: C.canvasAlt, border: `1px solid ${C.line}` }}
            >
              <Clock weight="duotone" className="h-6 w-6" style={{ color: C.goldInk }} />
            </span>
            <div className="min-w-0">
              <h3
                className="font-display font-bold text-[18px] leading-snug sm:text-[20px]"
                style={{ color: C.ink }}
              >
                Please be available{' '}
                <span style={{ color: C.goldDeep }}>5 minutes before</span> each
                live session.
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed" style={{ color: C.inkSoft }}>
                These are <strong>live, coach-led sessions</strong>. Arriving
                late may result in missing important instructions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Important policy ─────────────────────────────────────────── */}
      <section className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionEyebrow text="Please note" />
            <h2
              className="mt-3 font-display font-bold text-[24px] leading-tight sm:text-[32px]"
              style={{ color: C.ink }}
            >
              Important <span style={{ color: C.goldDeep }}>policy.</span>
            </h2>
            <p className="mt-3 text-[14.5px]" style={{ color: C.inkSoft }}>
              Because this is a live, structured experience:
            </p>
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {POLICY_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl p-5 text-center"
                style={{ background: C.canvas, border: `1px solid ${C.line}` }}
              >
                <X weight="bold" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.coralInk }} />
                <span
                  className="text-[13.5px] font-semibold leading-snug"
                  style={{ color: C.inkSoft }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div
            className="mt-8 rounded-2xl p-5 text-center"
            style={{ background: C.canvasAlt, border: `1px solid ${C.line}` }}
          >
            <p className="font-display font-bold text-[15px] " style={{ color: C.ink }}>
              Your spot has been reserved exclusively for you.
            </p>
            <p className="mt-1.5 text-[12.5px]" style={{ color: C.inkSoft }}>
              (Free seats are limited, so please join the community now.)
            </p>
          </div>
        </div>
      </section>

      {/* ── Prep checklist ───────────────────────────────────────────── */}
      <section className="px-5 pb-16 md:px-8 md:pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionEyebrow text="Quick prep" />
            <h2
              className="mt-3 font-display font-bold text-[24px] leading-tight sm:text-[32px]"
              style={{ color: C.ink }}
            >
              What to do <span style={{ color: C.goldDeep }}>before the call.</span>
            </h2>
            <p className="mt-3 text-[14.5px]" style={{ color: C.inkSoft }}>
              To get maximum results, please:
            </p>
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PREP_ITEMS.map((item, i) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: C.canvas, border: `1px solid ${C.line}` }}
              >
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-display font-bold text-[11.5px] "
                  style={{
                    background: `linear-gradient(135deg, ${C.goldMid}, ${C.goldDeep})`,
                    color: C.canvas,
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="text-[14px] font-medium leading-snug"
                  style={{ color: C.inkSoft }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-center text-[13.5px]" style={{ color: C.inkSoft }}>
            <ShieldCheck
              weight="fill"
              className="mr-1.5 inline-block h-4 w-4 align-text-bottom"
              style={{ color: C.goldInk }}
            />
            <strong style={{ color: C.ink }}>No prior experience required.</strong>{' '}
            Just show up and follow along.
          </p>
        </div>
      </section>

      {/* ── Final nudge ──────────────────────────────────────────────── */}
      {/* Ankita's version is near-black with a pink bloom. The equivalent dark
          stage in THIS project is the brand plum, which is what every dark
          section on the landing page uses, so a black band here would read as
          a different site. The bloom follows the brand accent, and it reads the
          token rather than a copied rgba literal, so a re-skin moves it too. */}
      <section
        className="relative isolate overflow-hidden px-5 py-16 md:px-8 md:py-20"
        style={{ background: C.plumDeep }}
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.09]"
          style={{
            background: `radial-gradient(ellipse at top, ${C.gold} 0%, transparent 62%)`,
          }}
        />
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="font-display font-bold text-[26px] leading-tight sm:text-[36px]"
            style={{ color: C.onDark }}
          >
            This is your <span style={{ color: C.gold }}>first step</span>
            <br className="hidden sm:block" /> toward starting every day at your
            best.
          </h2>
          <p className="mt-4 text-[14.5px]" style={{ color: C.onDarkMute }}>
            Now, join the community and we&rsquo;ll see you inside.
          </p>

          {WHATSAPP_INVITE && (
            <div className="mt-8">
              <a
                href={WHATSAPP_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-display font-bold text-[15px] shadow-2xl transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto sm:text-[16px]"
                style={{ color: WA.deep }}
              >
                <WhatsappLogo weight="fill" className="h-5 w-5" />
                Join the Community
                <ArrowRight
                  weight="bold"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />

      {/* ── Mobile sticky CTA: the page anchored on one action ────────── */}
      {WHATSAPP_INVITE && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 md:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div
            className="border-t px-4 pb-3 pt-3 shadow-[0_-8px_24px_-12px_rgba(88,51,79,0.25)] backdrop-blur"
            style={{ background: `${C.canvas}F2`, borderColor: C.line }}
          >
            <a
              href={WHATSAPP_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-display font-bold text-[14.5px] text-white shadow-md"
              style={{ background: `linear-gradient(135deg, ${WA.deep}, ${WA.green})` }}
            >
              <WhatsappLogo weight="fill" className="h-5 w-5" />
              Join the WhatsApp Community
              <ArrowRight weight="bold" className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </main>
  );
}

function DetailCard({
  icon: Icon,
  label,
  value,
  footnote,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  footnote?: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 text-left"
      style={{ background: C.canvas, border: `1px solid ${C.line}` }}
    >
      <div className="flex items-center gap-3">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg"
          style={{ background: C.goldPale }}
        >
          <Icon weight="duotone" className="h-5 w-5" style={{ color: C.goldInk }} />
        </span>
        <div className="min-w-0">
          <p
            className="text-[10.5px] font-bold uppercase tracking-[0.16em]"
            style={{ color: C.inkSoft }}
          >
            {label}
          </p>
          <p
            className="mt-0.5 font-display font-bold text-[14px] leading-snug"
            style={{ color: C.ink }}
          >
            {value}
          </p>
        </div>
      </div>
      {footnote && (
        <p className="mt-2 text-[11.5px]" style={{ color: C.inkSoft }}>
          {footnote}
        </p>
      )}
    </div>
  );
}

function SectionEyebrow({ text }: { text: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.2em]"
      style={{ background: C.goldWash, color: C.goldInk }}
    >
      <span
        aria-hidden
        className="inline-block h-1 w-1 rounded-full"
        style={{ background: C.goldInk }}
      />
      {text}
    </span>
  );
}




