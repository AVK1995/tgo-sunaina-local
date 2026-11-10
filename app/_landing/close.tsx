'use client';

/**
 * The closing half of the page: the coach, the bonuses, the FAQs and the
 * colophon. Copy follows COPY-SOURCE.md.
 */
import { Plus } from '@phosphor-icons/react/dist/ssr';

import SiteFooter from '@/components/SiteFooter';

import { asset } from './asset-version';
import Bonuses from './bonuses';
import { legoDelay } from './lego-style';
import { CTA_LABEL, CTA_SUBLABEL, PRICE, WORKSHOP_DATES } from './offer';
import { C, PrimaryCTA, SectionHeading } from './shared';

/* ══ Meet your coach ═══════════════════════════════════════════════════════
   A coach's story has no inherent structure, so it stays clean prose on a
   capped measure beside one portrait. */
const CREDENTIALS = ['15+ Years Of Experience', 'Certified Yoga Teacher', 'Certified Life Coach'];

function Guide() {
  const strong = { color: C.ink, fontWeight: 700 };

  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvasAlt }}>
      <SectionHeading
        eyebrow="MEET YOUR COACH"
        sub="Yoga, Mindfulness & Personal Development Coach"
      >
        <span style={{ color: C.goldDeep }}>Sunaina Setia</span>
      </SectionHeading>

      <ul className="mx-auto mt-6 flex max-w-[760px] flex-wrap justify-center gap-2">
        {CREDENTIALS.map((c) => (
          <li
            key={c}
            className="rounded-full px-3.5 py-1.5 text-[12.5px] font-bold"
            style={{ background: C.canvas, border: `1px solid ${C.lineStrong}`, color: C.ink }}
          >
            {c}
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-12 max-w-[1060px] lg:grid lg:grid-cols-[0.85fr_1fr] lg:items-center lg:gap-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset('/workshop/sunaina-coach.jpg')}
          alt="Sunaina Setia, Certified Yoga Teacher and Life Coach"
          width={939}
          height={1024}
          loading="lazy"
          className="mb-9 h-auto w-full rounded-3xl lg:mb-0"
          style={{ border: `1px solid ${C.line}` }}
        />

        <div className="space-y-4 text-[16px] leading-[1.75]" style={{ color: C.inkSoft }}>
          <p>
            For over{' '}
            <strong style={strong}>
              15 years, Sunaina Setia has been helping people build a healthier
              relationship with their minds, bodies and everyday lives
            </strong>{' '}
            through yoga, mindfulness and personal development.
          </p>
          <p>
            As a <strong style={strong}>certified yoga teacher and life coach</strong>,
            with training from{' '}
            <strong style={strong}>Erickson Coaching International</strong>, her
            work brings together practical techniques that help people manage
            stress, become more mindful and develop healthier daily habits.
          </p>
          <p>
            Her approach to better sleep is built around a simple understanding:{' '}
            <strong style={strong}>
              How you sleep at night is closely connected to how you manage your
              mind, body and habits throughout the day.
            </strong>
          </p>
          <p>
            That&rsquo;s why, in this 2-day workshop, Sunaina will guide you
            through practical evening techniques and her{' '}
            <strong style={strong}>S.T.A.R.T. Right morning routine</strong>,
            helping you build a more supportive rhythm from the moment you wake
            up to the moment you go to bed.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ══ FAQs ══════════════════════════════════════════════════════════════════
   Native <details>, so every answer works and is readable without JavaScript.
   The date and price come from ./offer. */
const FAQS: { q: string; a: string[] }[] = [
  {
    q: 'Is this workshop live or pre-recorded?',
    a: ["This is a 2-day live online workshop, where you'll learn directly from Sunaina Setia and participate in guided practices."],
  },
  {
    q: 'In which language will the workshop be conducted?',
    a: ['The workshop will be conducted in Hindi and English, making it easy to understand and follow along.'],
  },
  {
    q: 'When is the workshop, and how much does it cost?',
    a: [
      `The workshop will take place on ${WORKSHOP_DATES}.`,
      `You can join both live sessions for just ${PRICE}.`,
    ],
  },
  {
    q: 'Will I start sleeping better immediately after the workshop?',
    a: [
      "You'll be able to practise the techniques you learn on Day 1 that very night.",
      'Some people may notice improvements sooner, while others may need more time and consistency. The goal is to help you understand your sleep better and build habits that support long-term improvement.',
    ],
  },
  {
    q: 'Will I need to buy any special products or equipment?',
    a: [
      "No. You won't need expensive sleep products, supplements or special equipment.",
      'The workshop focuses on practical techniques and daily habits that you can incorporate into your existing routine.',
    ],
  },
  {
    q: "I'm currently taking sleeping pills. Can I still attend?",
    a: [
      'Absolutely. The workshop focuses on natural sleep-supporting practices, including breathing exercises, gentle stretches, mindfulness and healthier bedtime routines.',
      'However, please continue taking any prescribed medication as directed by your doctor. Never reduce or stop sleeping medication without medical guidance.',
    ],
  },
  {
    q: 'Why does a sleep workshop include a morning session?',
    a: [
      "Because your sleep isn't influenced only by what you do at bedtime.",
      'Your morning routine, daily habits and stress levels can also affect how well you sleep at night.',
      "That's why Day 2 includes a guided S.T.A.R.T. Right morning experience to help you understand how to build healthier habits throughout your day.",
    ],
  },
  {
    q: "I've already tried meditation, yoga and different sleep remedies. How is this workshop different?",
    a: [
      'Rather than focusing on just one technique, this workshop helps you understand how your thoughts, stress levels, bedtime habits and morning routine can influence your sleep.',
      "You'll learn different practical techniques and how to combine them into a routine that works for your lifestyle.",
    ],
  },
];

function Faq() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvasAlt }}>
      <SectionHeading>
        Frequently Asked <span style={{ color: C.goldDeep }}>Questions</span>
      </SectionHeading>

      <div className="mx-auto mt-12 grid max-w-[820px] gap-3">
        {FAQS.map(({ q, a }, idx) => (
          <details
            key={q}
            data-lego=""
            className="group rounded-2xl"
            style={{
              ...legoDelay(idx, 50),
              background: C.canvas,
              border: `1px solid ${C.line}`,
            }}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
              <span
                className="font-display font-bold text-[16px] leading-snug sm:text-[17px]"
                style={{ color: C.ink }}
              >
                {q}
              </span>
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition-transform duration-200 group-open:rotate-45"
                style={{ background: C.goldPale }}
              >
                <Plus weight="bold" className="h-3.5 w-3.5" style={{ color: C.goldInk }} />
              </span>
            </summary>
            <div
              className="space-y-3 px-5 pb-5 text-[15px] leading-relaxed sm:px-6"
              style={{ color: C.inkSoft }}
            >
              {a.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </details>
        ))}
      </div>

      {/* The docked bar hides once this button is on screen, so the reader
          never sees two copies of the same action at the foot of the page. */}
      <div data-final className="mx-auto mt-10 flex max-w-[460px] justify-center">
        <PrimaryCTA label={CTA_LABEL} sub={CTA_SUBLABEL} full />
      </div>
    </section>
  );
}

/* ══ Colophon ══════════════════════════════════════════════════════════════
   The disclaimer lives in the shared SiteFooter, so it appears on the checkout
   and the thank-you page too rather than only on the landing page. */
function Colophon() {
  return (
    <SiteFooter>
      <p className="mx-auto mb-8 max-w-[640px] text-[13px]" style={{ color: C.onDarkMute }}>
        {WORKSHOP_DATES} · Live Online · Hindi &amp; English · {PRICE}
      </p>
    </SiteFooter>
  );
}

export default function Close() {
  return (
    <>
      <Guide />
      <Bonuses />
      <Faq />
      <Colophon />
    </>
  );
}
