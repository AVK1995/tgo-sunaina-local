'use client';

/**
 * Everything below the hero, in the order COPY-SOURCE.md sets out:
 *
 *   Who can benefit ............. this file
 *   Bring back your energy ...... this file
 *   Testimonials ................ ./proof
 *   Remember when ............... this file
 *   What you'll learn ........... this file
 *   Coach, bonuses, FAQs ........ ./close
 *
 * The source marks the two-day plan with emoji. They render as matched line
 * icons instead, the same treatment the rest of this page uses, because emoji
 * look different on every device the audience owns. The words are untouched.
 */
import type { Icon } from '@phosphor-icons/react';
import {
  Armchair,
  Bed,
  BatteryCharging,
  Brain,
  Briefcase,
  ChartLineUp,
  Heartbeat,
  HandHeart,
  House,
  MoonStars,
  Pill,
  Scales,
  ShieldPlus,
  Smiley,
  Storefront,
  Sun,
} from '@phosphor-icons/react/dist/ssr';

import Close from './close';
import { asset } from './asset-version';
import { legoBrick, legoDelay } from './lego-style';
import { domAnimation, LazyMotion } from './motion-lite';
import Proof from './proof';
import { C, SectionHeading } from './shared';

/* Four beds, rotated. The brand has few colours, and a card grid that cycles a
   rainbow reads as decoration rather than as a set. */
const BEDS = [
  { bed: C.goldPale, fg: C.goldInk },
  { bed: C.coralBed, fg: C.coralInk },
  { bed: C.plumBed, fg: C.ink },
  { bed: C.roseBed, fg: C.ink },
];

/* ══ Who can benefit ═══════════════════════════════════════════════════════ */
const AUDIENCE: { icon: Icon; text: string }[] = [
  { icon: Briefcase, text: 'Working Professionals' },
  { icon: House, text: 'Parents & Homemakers' },
  { icon: ChartLineUp, text: 'Corporate Leaders & Executives' },
  { icon: HandHeart, text: 'Senior Citizens' },
  { icon: Storefront, text: 'Business Owners & Entrepreneurs' },
  { icon: Armchair, text: 'Retired Professionals' },
];

function WhoCanBenefit() {
  return (
    <section className="px-4 py-12 sm:py-20" style={{ background: C.canvas }}>
      <SectionHeading sub="If You Belong To Any Of These Groups, You're In The Right Place.">
        Who Can <span style={{ color: C.goldDeep }}>Benefit</span> From This Workshop?
      </SectionHeading>

      <ul className="mx-auto mt-10 grid max-w-[980px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {AUDIENCE.map(({ icon: Glyph, text }, idx) => {
          const skin = BEDS[idx % BEDS.length];
          return (
            <li
              key={text}
              data-lego=""
              className="lego-hover-sm flex items-center gap-3.5 rounded-2xl px-5 py-4"
              style={{
                ...legoBrick(idx, 60),
                border: `1px solid ${C.line}`,
                background: C.canvas,
              }}
            >
              <span
                className="lego-stud grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                style={{ background: skin.bed }}
              >
                <Glyph weight="duotone" className="h-5 w-5" style={{ color: skin.fg }} />
              </span>
              <span
                className="font-display font-bold text-[15.5px] leading-snug"
                style={{ color: C.ink }}
              >
                {text}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ══ Bring back your energy ════════════════════════════════════════════════ */
const BENEFITS: { icon: Icon; title: string; body: string }[] = [
  {
    icon: Bed,
    title: 'Get 7–9 Hours Of Restful Sleep',
    body: 'And Wake Up Feeling Properly Recharged Every Morning.',
  },
  {
    icon: MoonStars,
    title: 'Fall Asleep Faster & Stay Asleep Longer',
    body: 'Without Spending Half The Night Tossing And Turning.',
  },
  {
    icon: Pill,
    title: 'Reduce Reliance On Sleeping Pills',
    body: 'And Build Natural Sleep Habits',
  },
  {
    icon: Brain,
    title: 'Improve Your Memory, Focus & Mental Sharpness',
    body: 'And think clearly & perform better throughout the day.',
  },
  {
    icon: Scales,
    title: 'Support A Healthier Metabolism & Weight Management',
    body: 'By helping regulate hunger hormones and energy balance.',
  },
  {
    icon: Heartbeat,
    title: 'Support Heart Health & Healthy Blood Pressure',
    body: 'By giving your cardiovascular system the rest it needs.',
  },
  {
    icon: ShieldPlus,
    title: "Strengthen Your Body's Immunity & Recovery",
    body: 'By supporting the natural repair processes that happen during sleep.',
  },
  {
    icon: BatteryCharging,
    title: 'Feel More Energetic, Happier & Emotionally Balanced',
    body: 'So you can enjoy your work, family and everyday life.',
  },
];

function Benefits() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvasAlt }}>
      <SectionHeading>
        What If You Could <span style={{ color: C.goldDeep }}>Bring Back</span> The
        Energy &amp; Enthusiasm You Had As A Child &amp; Feel Healthier Than You
        Have In Years?
      </SectionHeading>

      <ul className="mx-auto mt-14 grid max-w-[1180px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map(({ icon: Glyph, title, body }, idx) => {
          const skin = BEDS[idx % BEDS.length];
          return (
            <li
              key={title}
              data-lego=""
              className="lego-hover flex flex-col rounded-3xl p-6"
              style={{
                ...legoBrick(idx),
                background: C.canvas,
                border: `1px solid ${C.line}`,
                borderTop: `3px solid ${skin.bed}`,
              }}
            >
              <span
                data-lego-stud=""
                className="lego-stud grid h-12 w-12 place-items-center rounded-2xl"
                style={{ ...legoBrick(idx), background: skin.bed }}
              >
                <Glyph weight="duotone" className="h-6 w-6" style={{ color: skin.fg }} />
              </span>
              <h3
                className="mt-5 font-display font-bold text-[18px] leading-snug"
                style={{ color: C.ink }}
              >
                {title}
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: C.inkSoft }}>
                {body}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ══ Remember when ═════════════════════════════════════════════════════════ */
function RememberWhen() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvasAlt }}>
      <SectionHeading>
        Remember When Falling Asleep Was The{' '}
        <span style={{ color: C.goldDeep }}>Easiest</span> Part Of Your Day?
      </SectionHeading>

      <div className="mx-auto mt-10 max-w-[820px] text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset('/workshop/sleep-then-now.jpg')}
          alt="A baby sleeping peacefully beside an adult lying awake with a tangled mind"
          width={1536}
          height={1024}
          loading="lazy"
          className="h-auto w-full rounded-3xl"
          style={{ border: `1px solid ${C.line}` }}
        />

        <p
          className="mt-9 font-display font-bold text-[19px] uppercase leading-snug tracking-[0.04em] sm:text-[23px]"
          style={{ color: C.ink }}
        >
          Growing Up Was Inevitable. Losing Your Sleep Wasn&rsquo;t.
        </p>
        <p className="mt-5 text-[16px] leading-[1.75]" style={{ color: C.inkSoft }}>
          As a child, you went to bed without a care in the world.
          <br />
          Today, you carry the weight of your entire world to bed with you.
        </p>
        <p
          className="mt-5 font-display font-bold text-[18px] leading-snug sm:text-[20px]"
          style={{ color: C.goldInk }}
        >
          But peaceful sleep doesn&rsquo;t have to remain a childhood memory.
        </p>
        <p className="mt-4 text-[16px] leading-[1.75]" style={{ color: C.inkSoft }}>
          And that&rsquo;s exactly what we&rsquo;ll help you work towards in this
          2-day workshop.
        </p>
      </div>
    </section>
  );
}

/* ══ What you'll learn ═════════════════════════════════════════════════════ */
const PLAN: {
  day: string;
  name: string;
  icon: Icon;
  sub: string;
  items: { icon: Icon; title: string; body: string }[];
}[] = [
  {
    day: 'Day 1',
    name: 'Win Your Nights',
    icon: MoonStars,
    sub: 'Learn How To Prepare Your Mind & Body For Deep, Restful Sleep',
    items: [
      {
        icon: Bed,
        title: "Understand What's Really Keeping You Awake",
        body: "Discover why stress, overthinking and everyday habits can make falling asleep so difficult, even when you're physically exhausted.",
      },
      {
        icon: Bed,
        title: 'Learn Practical Ways To Quiet Your Mind Before Bed',
        body: 'Experience simple breathing techniques, gentle stretches and calming practices to help you unwind after a long day.',
      },
      {
        icon: Bed,
        title: 'Create Your Own Sleep Preparation Routine',
        body: 'Learn how to combine practical bedtime habits into a routine that works with your lifestyle, without spending hours preparing for sleep.',
      },
      {
        icon: Bed,
        title: "Put What You've Learned Into Practice That Very Night",
        body: 'Walk away with a simple bedtime checklist and try the practices yourself before returning for Day 2.',
      },
    ],
  },
  {
    day: 'Day 2',
    name: 'Own Your Mornings',
    icon: Sun,
    sub: 'Discover How To Wake Up & Start Your Day Right',
    items: [
      {
        icon: Sun,
        title: "Experience Sunaina's Guided S.T.A.R.T. Right Morning Routine",
        body: 'Participate in a live session designed to help you begin your morning with greater calm, energy and intention.',
      },
      {
        icon: Sun,
        title: 'Understand How Your Daytime Habits Influence Your Sleep',
        body: 'Explore the connection between your daily routine, stress levels and how easily you unwind at night.',
      },
      {
        icon: Sun,
        title: 'Learn How To Build A More Consistent Morning Routine',
        body: 'Discover simple ways to make your mornings more intentional, even with a busy work and family schedule.',
      },
      {
        icon: Smiley,
        title: 'Take Your First Step Towards Lasting Change',
        body: 'Understand how small, consistent practices can support better sleep habits and a healthier daily rhythm over time.',
      },
    ],
  },
];

function WhatYoullLearn() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvas }}>
      <SectionHeading>
        Here&apos;s What You&apos;ll <span style={{ color: C.goldDeep }}>Learn</span>{' '}
        In The 2-Day Workshop
      </SectionHeading>

      <div className="mx-auto mt-14 grid max-w-[1080px] items-start gap-6 lg:grid-cols-2">
        {PLAN.map(({ day, name, icon: DayIcon, sub, items }, planIdx) => (
          <article
            key={day}
            data-lego=""
            className="overflow-hidden rounded-[28px]"
            style={{
              ...legoDelay(planIdx, 110),
              background: C.canvas,
              border: `1px solid ${C.lineStrong}`,
              boxShadow: '0 24px 54px -34px rgba(88,51,79,0.3)',
            }}
          >
            <header className="px-7 py-7 sm:px-8" style={{ background: C.plumDeep }}>
              <span
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: C.gold }}
              >
                <DayIcon weight="fill" className="h-4 w-4" />
                {day}
              </span>
              <h3
                className="mt-2 font-display font-bold text-[26px] leading-tight"
                style={{ color: C.onDark }}
              >
                {name}
              </h3>
              <p className="mt-2 text-[15px] leading-snug" style={{ color: C.onDarkMute }}>
                {sub}
              </p>
            </header>

            <ul className="divide-y px-7 sm:px-8" style={{ borderColor: C.line }}>
              {items.map(({ icon: Glyph, title, body }) => (
                <li
                  key={title}
                  className="flex items-start gap-4 py-5"
                  style={{ borderColor: C.line }}
                >
                  <span
                    className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                    style={{ background: C.goldPale }}
                  >
                    <Glyph weight="duotone" className="h-5 w-5" style={{ color: C.goldInk }} />
                  </span>
                  <span className="min-w-0">
                    <span
                      className="block font-display font-bold text-[16.5px] leading-snug"
                      style={{ color: C.ink }}
                    >
                      {title}
                    </span>
                    <span
                      className="mt-1.5 block text-[14.5px] leading-relaxed"
                      style={{ color: C.inkSoft }}
                    >
                      {body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function BelowFold() {
  /* LazyMotion mounts the single IntersectionObserver that adds `bw-in` to
     revealed elements. Without it every .bw-reveal-* stays at opacity 0 once
     .bw-js is on the document. */
  return (
    <LazyMotion features={domAnimation}>
      <WhoCanBenefit />
      <Benefits />
      <Proof />
      <RememberWhen />
      <WhatYoullLearn />
      <Close />
    </LazyMotion>
  );
}
