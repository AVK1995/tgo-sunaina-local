'use client';

/**
 * Everything below the hero. Proof leads (2026-09-24): the testimonials sit
 * directly under the hero, then the rest in the order COPY-SOURCE.md sets out:
 *
 *   7  Testimonials ................... ./proof   ← moved up, first below hero
 *   3  Here's what you'll experience .. this file
 *   4  Your 5-Day Schedule ............ this file  ← the signature beat
 *   5  Daily live morning sessions .... this file
 *   6  Does this sound like you? ...... this file
 *   8  The toolkit .................... ./toolkit
 *   9  Meet your coach ................ ./close
 *  10  Why this works ................. ./close
 *  11  The results .................... ./close
 *  12  Two options .................... ./close
 *  13  Recap + final CTA .............. ./close  ← the premium peak
 *  14  Disclaimer + colophon .......... ./close
 *
 * COPY IS VERBATIM. Where the source wraps a sentence across several lines it
 * is joined back into one string; no wording, ordering or punctuation is
 * changed, and nothing is added.
 */
import {
  ArrowRight,
  CalendarBlank,
  ChatCircleText,
  Clock,
  Compass,
  FlowerLotus,
  PersonSimpleWalk,
  UsersThree,
  Wind,
  XSquare,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import Close from './close';
import { legoBrick, legoDelay } from './lego-style';
import { domAnimation, LazyMotion } from './motion-lite';
import { CHECKOUT_HREF, CTA_LABEL, CTA_NOTE, SESSION_TIMES } from './offer';
import Proof from './proof';
import { C, SectionHeading } from './shared';
import Toolkit from './toolkit';

/* Three beds, rotated. Not seven: the brand has three colours, and a card grid
   that cycles a rainbow reads as decoration rather than as a set. */
const BEDS = [
  { bed: C.goldPale, fg: C.goldInk },
  { bed: C.coralBed, fg: C.coralInk },
  { bed: C.plumBed, fg: C.ink },
  /* Dusty rose, as its wash. Plum reads 8.7:1 on it. */
  { bed: C.roseBed, fg: C.ink },
];

/* ══ 3 · Here's What You'll Experience In 5 Days ═══════════════════════════
   Six parallel capabilities, each with a title and a body. A set, not a
   sequence, so it is a grid of equal pieces and the ordering carries no
   meaning the reader has to follow. */
const EXPERIENCE = [
  {
    icon: Compass,
    title: 'Your ‘S.T.A.R.T. Right’ Morning Formula',
    body: 'Experience the five-part morning sequence of Stillness, Movement, Affirmation, Reset & Connection, deliberately arranged to help you enter your day in the right state.',
  },
  {
    icon: FlowerLotus,
    title: 'A Mind That Finally Gets Quiet',
    body: 'Start your morning with chanting and stillness before the noise of work, family, notifications and responsibilities begins. Give yourself a few minutes where you don’t have to react to anything.',
  },
  {
    icon: PersonSimpleWalk,
    title: 'Move The Stress Out Of Your Body',
    body: 'Use yoga and light movement to open up your body and release built-up tension, with moments of dance that bring energy, joy and a little playfulness into the morning, so movement becomes something you actually look forward to.',
  },
  {
    icon: Wind,
    title: 'Reset Your Energy & Focus',
    body: 'Learn simple breathing practices that help you slow down, regulate your state and bring your attention back to where you want it, instead of carrying yesterday’s stress into today.',
  },
  {
    icon: ChatCircleText,
    title: 'Start Speaking To Yourself Differently',
    body: 'Use guided affirmations to strengthen the way you think and speak to yourself, helping you approach everyday challenges with a calmer mind, a stronger perspective and greater belief in your ability to handle them.',
  },
  {
    icon: UsersThree,
    title: 'Live Guidance & A Like-Minded Community',
    body: 'Get expert guidance from Sunaina and practise alongside an uplifting community that keeps you supported, motivated and excited to show up each morning.',
  },
];

function Experience() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvas }}>
      <SectionHeading sub="A fun, live morning experience designed to help you feel the difference in your mind, body & energy before making it a part of your everyday life.">
        Here&apos;s What You&apos;ll Experience{' '}
        <span style={{ color: C.goldDeep }}>In 5 Days</span>
      </SectionHeading>

      <ul className="mx-auto mt-14 grid max-w-[1120px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {EXPERIENCE.map(({ icon: Icon, title, body }, idx) => {
          /* Six cards fill both grids exactly (2-col: 3 rows · 3-col: 2 rows),
             so no orphan placement fires. The maths stays in place because the
             item count is the client's to change: a 5th or 7th card would
             strand one in the last row, and this centres it rather than leaving
             it hard-left. The widths mirror the gap-5 (20px) track maths at each
             breakpoint. */
          const isOrphan = idx === EXPERIENCE.length - 1;
          const placement = [
            isOrphan && EXPERIENCE.length % 2 === 1
              ? 'sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[calc(50%-10px)]'
              : '',
            isOrphan && EXPERIENCE.length % 3 === 1
              ? 'lg:col-span-3 lg:mx-auto lg:max-w-[calc(33.333%-13.334px)]'
              : '',
          ]
            .filter(Boolean)
            .join(' ');
          const skin = BEDS[idx % BEDS.length];

          return (
            <li
              key={title}
              data-lego=""
              className={`lego-hover flex flex-col rounded-3xl p-7 ${placement}`}
              style={{
                ...legoBrick(idx),
                background: C.canvas,
                border: `1px solid ${C.line}`,
                /* A 3px rule along the top edge ties the card to its bed
                   without letting colour take a large area. */
                borderTop: `3px solid ${skin.bed}`,
              }}
            >
              <span
                data-lego-stud=""
                className="lego-stud grid h-12 w-12 place-items-center rounded-2xl"
                style={{ ...legoBrick(idx), background: skin.bed }}
              >
                <Icon weight="duotone" className="h-6 w-6" style={{ color: skin.fg }} />
              </span>
              <h3
                className="mt-5 font-display font-bold text-[19px] leading-snug"
                style={{ color: C.ink }}
              >
                {title}
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed" style={{ color: C.inkSoft }}>
                {body}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ══ 4 · Your 5-Day Schedule ═══════════════════════════════════════════════
   The signature beat, and the page's ONE heavy motion moment.

   Five mornings are a genuine sequence: each one is described as building on
   the last, so the structure is a spine with a filling rail rather than five
   cards in a row. The rail's progress is a single CSS variable written by a
   rAF-throttled scroll handler; nodes ignite as the fill reaches them.

   THE SOURCE CONTRADICTION IS RESOLVED (2026-09-18, Atul). This section was
   headed "Your 5-Day Schedule" while listing SIX days and decking "6
   mornings"; both were rendered as written because only the client could say
   which number was wrong. It is five. The old DAY 05 (see your own shift) and
   DAY 06 (understand the method, what's next) are now one DAY 05 carrying
   both, written to the same length as the days around it so the spine's
   cards stay even. */
const DAYS = [
  {
    n: 'DAY 01',
    title: 'Discover Your Starting Point',
    body: 'Experience the complete S.T.A.R.T. Right Method live, and establish your personal baseline for how you’re feeling when you begin.',
  },
  {
    n: 'DAY 02',
    title: 'Quiet Your Mind. Move Your Body',
    body: 'Experience a fresh variation of the full method, using stillness, movement and breathwork to create a calmer, more intentional start to your day.',
  },
  {
    n: 'DAY 03',
    title: 'Shift Your Energy',
    body: 'Continue with a new mix of practices within the complete S.T.A.R.T. sequence and experience how changing the way you begin your morning can change the way you feel going into your day.',
  },
  {
    n: 'DAY 04',
    title: 'Break The Autopilot',
    body: 'Keep showing up for the full morning practice and experience what changes when your mornings stop running on the same automatic loop and start becoming something you consciously choose.',
  },
  {
    n: 'DAY 05',
    title: 'See Your Shift. Understand The Method',
    body: 'Complete your fifth S.T.A.R.T. morning, revisit your personal baseline and see what has changed, then step beyond the practice to understand why the method works and what comes next.',
  },
];

/**
 * Scroll-linked progress for the spine.
 *
 * Writes `--tl-p` (0 to 1) straight onto the <ol> node, so the rail fills
 * without React re-rendering once per frame. The only React state is `active`,
 * which changes five times per pass at most.
 *
 * The "read line" sits at 62% of the viewport height rather than the middle: a
 * day should light as it arrives at the comfortable reading position, not once
 * it has already gone past.
 */
function useSpineProgress(count: number) {
  const olRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const ol = olRef.current;
    if (!ol) return;

    // Reduced motion: show the finished state and never listen to scroll.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ol.style.setProperty('--tl-p', '1');
      setActive(count - 1);
      return;
    }

    let raf = 0;
    const measure = () => {
      raf = 0;
      const box = ol.getBoundingClientRect();
      if (!box.height) return;

      const line = window.innerHeight * 0.62;
      const p = Math.min(1, Math.max(0, (line - box.top) / box.height));
      ol.style.setProperty('--tl-p', p.toFixed(4));

      /* offsetTop is no use here: each node's offsetParent is its own <li>,
         not the list. Both rects are current, so the difference is the node's
         position within the rail. */
      const travelled = p * box.height;
      let last = -1;
      ol.querySelectorAll<HTMLElement>('[data-tl-node]').forEach((node, i) => {
        const r = node.getBoundingClientRect();
        if (travelled >= r.top + r.height / 2 - box.top) last = i;
      });
      setActive(last);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count]);

  return { olRef, active };
}

function Schedule() {
  const { olRef, active } = useSpineProgress(DAYS.length);

  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvasAlt }}>
      <SectionHeading sub="5 mornings. 60 minutes each. One powerful formula to help you start every day at your best.">
        Your <span style={{ color: C.goldDeep }}>5-Day Schedule</span>
      </SectionHeading>

      {/* Alternating spine. The rail is centred on desktop and slides to the
          left edge on mobile, where a zig-zag has no room. */}
      <ol ref={olRef} className="relative mx-auto mt-14 max-w-[920px]">
        <span aria-hidden className="tl-rail">
          <span className="tl-fill" />
        </span>

        {DAYS.map((d, i) => {
          const left = i % 2 === 0; // card in the left column on desktop
          return (
            <li
              key={d.n}
              className={`relative mb-6 pl-14 sm:mb-9 sm:w-1/2 sm:pl-0 ${
                left ? 'sm:pr-12 sm:text-right' : 'sm:ml-auto sm:pl-12'
              }`}
            >
              {/* Positioning lives on the outer span and the snap animation on
                  the inner one: one element cannot both hold a centring
                  translate and keyframe its transform. */}
              <span
                data-tl-node
                className={`tl-node ${left ? 'tl-node-right' : 'tl-node-left'} ${
                  i <= active ? 'is-on' : ''
                }`}
              >
                <span aria-hidden className="tl-node-ring" />
                <span className="tl-node-inner">{i + 1}</span>
              </span>

              {/* data-lego-loop, not data-lego: this is the ONE run on the page
                  that replays on every scroll pass, because the spine is meant
                  to be re-read. */}
              <div
                data-lego-loop="x"
                className="lego-hover rounded-2xl p-6"
                style={{
                  ...legoDelay(0),
                  ['--lego-from' as string]: left ? '26px' : '-26px',
                  border: `1px solid ${i <= active ? C.lineStrong : C.line}`,
                  background: C.canvas,
                }}
              >
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
                    left ? 'sm:flex-row-reverse' : ''
                  }`}
                  style={{ background: C.coralBed, color: C.coralInk }}
                >
                  <CalendarBlank weight="bold" className="lego-stud h-3 w-3" />
                  {d.n}
                </span>
                <h3
                  className="mt-3.5 font-display font-bold text-[20px] leading-snug"
                  style={{ color: C.ink }}
                >
                  {d.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: C.inkSoft }}>
                  {d.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ══ 5 · Daily Live Morning Sessions ═══════════════════════════════════════
   A CTA band, not a section with a structure: one timing and a click. It is a
   dark CARD inside a light band, because the page keeps exactly one dark
   section, the hero. */
function SessionsBand() {
  return (
    <section className="px-4 py-14" style={{ background: C.canvas }}>
      <div
        className="mx-auto max-w-[920px] rounded-[28px] px-6 py-12 text-center sm:px-12"
        style={{
          background: C.plumDeep,
          boxShadow: '0 30px 60px -34px rgba(88,51,79,0.55)',
        }}
      >
        <span
          data-lego=""
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.2em]"
          style={{ background: 'rgba(242,180,95,0.14)', color: C.gold }}
        >
          <Clock weight="bold" className="h-3 w-3" />
          DAILY LIVE MORNING SESSIONS
        </span>

        <h2
          className="mx-auto mt-6 max-w-[620px] font-display font-bold text-[clamp(26px,3.8vw,38px)] leading-[1.16]"
          style={{ color: C.onDark }}
        >
          {SESSION_TIMES} · <span style={{ color: C.gold }}>Live on Zoom</span>
        </h2>
        <p className="mt-3 text-[15.5px]" style={{ color: C.onDarkMute }}>
          Give yourself one powerful hour every morning to Start Right.
        </p>

        <div className="mx-auto mt-8 flex max-w-[430px] flex-col items-center">
          <Link
            href={CHECKOUT_HREF}
            data-cta
            className="lego-press cta-shimmer group inline-flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-full px-7 font-body text-[15px] font-bold"
            style={{
              background: C.gold,
              color: C.inkBody,
              border: `1px solid ${C.goldDeep}`,
              ['--shimmer' as string]: 'rgba(255,255,255,0.55)',
            }}
          >
            <span className="inline-flex items-center gap-2.5">
              {CTA_LABEL}
              <ArrowRight
                weight="bold"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </span>
          </Link>
          <p className="mt-3.5 text-[13.5px] font-medium" style={{ color: C.onDarkMute }}>
            {CTA_NOTE}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ══ 6 · Does this sound like you? ═════════════════════════════════════════
   A one-sided recognition list: every line is meant to land, so there is no
   second column and nothing to weigh against.

   ⚠️ FLAG FOR ATUL: the source marks each line with a ☑️. These five lines are
   PAINS, not features, so they render as coral × glyphs rather than as ticks.
   A tick beside "you never seem to stick with them long enough" reads as a
   benefit. The words are untouched; only the marker changes.

   The highlighted phrase in each line is TYPOGRAPHY, not an edit: the words and
   their order are exactly as written. */
const RECOGNITION: [string, string, string][] = [
  [
    'You know you have more in you, but lately ',
    'you don’t feel like you’re operating anywhere close to your best',
    '.',
  ],
  [
    'Your body wakes up in the morning, but ',
    'your mind never really switched off from the night before',
    ', and yesterday’s thoughts and today’s responsibilities are already waiting for you.',
  ],
  [
    'You’re not short of knowing what to do. You’ve tried meditation, exercise, morning routines and better habits, but ',
    'you never seem to stick with them long enough',
    '.',
  ],
  [
    'You can still handle everything life throws at you, but ',
    'it takes more out of you than it used to',
    '. Stress lingers longer, patience runs out faster and your energy doesn’t recover as quickly.',
  ],
  [
    'You’re always showing up somewhere, for work, family, the house or other people, but ',
    'there’s rarely a fixed part of the day where you show up for yourself',
    '.',
  ],
];

function Recognition() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvasAlt }}>
      <SectionHeading>
        Does this <span style={{ color: C.goldDeep }}>sound like you</span>?
      </SectionHeading>

      <ul className="mx-auto mt-12 grid max-w-[820px] gap-3">
        {RECOGNITION.map(([pre, hl, post], idx) => (
          <li
            key={hl}
            data-lego=""
            className="lego-hover-sm flex items-start gap-4 rounded-2xl px-5 py-4"
            style={{
              ...legoDelay(idx),
              border: `1px solid ${C.line}`,
              background: C.canvas,
            }}
          >
            <span
              className="lego-stud mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
              style={{ background: C.coralBed }}
            >
              <XSquare weight="fill" className="h-3.5 w-3.5" style={{ color: C.coralInk }} />
            </span>
            <span className="text-[15px] leading-relaxed" style={{ color: C.inkSoft }}>
              {pre}
              <strong style={{ color: C.ink, fontWeight: 700 }}>{hl}</strong>
              {post}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function BelowFold() {
  /* LazyMotion mounts the single IntersectionObserver that adds `bw-in` to
     revealed elements. Without it every .bw-reveal-* stays at opacity 0 once
     .bw-js is on the document. */
  return (
    <LazyMotion features={domAnimation}>
      <Proof />
      <Experience />
      <Schedule />
      <SessionsBand />
      <Recognition />
      <Toolkit />
      <Close />
    </LazyMotion>
  );
}
