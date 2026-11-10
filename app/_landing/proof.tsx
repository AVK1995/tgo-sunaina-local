'use client';

/**
 * Section 7 · proof.
 *
 * ONE proof surface: nine exhibit-framed video cards. The screenshot wall that
 * used to sit under it is cut. Its source table was empty and no assets were
 * ever supplied, and nine real clients on camera do not need a second, weaker
 * form of the same claim propping them up.
 *
 * 7a IS LIVE: nine real client clips, supplied by Atul, hosted on the Trainer
 * GoesOnline Vimeo account and embedded as players rather than as files. Their
 * true dimensions are 240x426, so the frame is 9/16 and nothing letterboxes.
 * Every iframe is lazy: nine eager Vimeo players would each pull the platform's
 * own runtime on first paint. The names are the only meta shown, exactly as
 * supplied, with no invented city, star rating, quote or result.
 *
 * PendingFrame stays: it is the empty state for any card whose clip is pulled
 * or replaced later, so a missing id reads as a reserved frame rather than as a
 * hole in the grid.
 */
import { Images } from '@phosphor-icons/react/dist/ssr';

import { legoBrick } from './lego-style';
import { C, SectionHeading } from './shared';

type Testimonial = { label: string; vimeoId?: string; meta?: string };

/* Names exactly as Atul supplied them, in the order he supplied them. `label`
   carries the accessible name of the player; `meta` is the caption under the
   card. They are the same string because a name is all we have been given, and
   a city or a result would have to be invented to fill the line. */
const TESTIMONIALS: Testimonial[] = [
  { label: 'Pooja', meta: 'Pooja', vimeoId: '1223573097' },
  { label: 'Munni', meta: 'Munni', vimeoId: '1223573921' },
  { label: 'Rakesh', meta: 'Rakesh', vimeoId: '1223573918' },
  { label: 'Pachuri', meta: 'Pachuri', vimeoId: '1223573919' },
  { label: 'Kanchan', meta: 'Kanchan', vimeoId: '1223573920' },
  { label: 'Neelam', meta: 'Neelam', vimeoId: '1223574061' },
  { label: 'Pinky', meta: 'Pinky', vimeoId: '1223574098' },
  { label: 'Tarun', meta: 'Tarun', vimeoId: '1223574207' },
  { label: 'Renu', meta: 'Renu', vimeoId: '1223574333' },
];


/* The empty state. Flat, ruled and honestly labelled: no gradient standing in
   for a photograph, and no invented poster art. It should look like a frame
   waiting for its exhibit, because that is what it is. */
function PendingFrame({ label, note }: { label: string; note: string }) {
  return (
    <span className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
      <span
        className="grid h-11 w-11 place-items-center rounded-full"
        style={{ background: C.goldPale }}
      >
        <Images weight="duotone" className="h-5 w-5" style={{ color: C.goldInk }} />
      </span>
      <span
        className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em]"
        style={{ color: C.ink }}
      >
        {label}
      </span>
      <span className="text-[11.5px]" style={{ color: C.inkSoft }}>
        {note}
      </span>
    </span>
  );
}

export default function Proof() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvas }}>
      <SectionHeading>
        From <span style={{ color: C.goldDeep }}>Better Sleep To Better Health</span>,
        See The Changes People Have Experienced In Their Lives.
      </SectionHeading>

      {/* ── 7a · the exhibit frames ──────────────────────────────────────
          Poster in a mat with an inner hairline ring, so each card reads as an
          exhibit rather than as a quote box, with an on-brand play disc instead
          of a platform-red triangle. */}
      <ul className="mx-auto mt-14 grid max-w-[340px] grid-cols-1 gap-5 sm:max-w-[960px] sm:grid-cols-3">
        {TESTIMONIALS.map((t, idx) => (
          <li
            key={t.label}
            data-lego=""
            /* No hover lift once a real clip is in: the card IS the player, and
               moving it under the cursor fights the scrub bar the reader is
               aiming at. Entrance animation only. */
            className="rounded-3xl p-3"
            style={{
              ...legoBrick(idx, 110),
              background: C.canvas,
              border: `1px solid ${C.line}`,
              boxShadow: '0 18px 40px -28px rgba(88,51,79,0.3)',
            }}
          >
            <div
              className="relative flex aspect-[9/16] items-center justify-center overflow-hidden rounded-2xl"
              style={{
                background: C.canvasAlt,
                boxShadow: `inset 0 0 0 1px ${C.line}`,
              }}
            >
              {t.vimeoId ? (
                /* No custom play disc over the player: Vimeo's own control is
                   the affordance, and a decorative one on top of it only gets
                   in the way of the thing the reader is aiming at.

                   loading="lazy" is doing real work here. Nine eager embeds
                   would each fetch the Vimeo runtime before the reader has
                   scrolled anywhere near them. dnt=1 asks Vimeo not to track
                   the viewer, which is both the decent default and one less
                   thing for the privacy policy to have to cover. */
                <iframe
                  src={`https://player.vimeo.com/video/${t.vimeoId}?dnt=1`}
                  title={t.label}
                  loading="lazy"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="h-full w-full border-0"
                />
              ) : (
                <PendingFrame label={t.label} note="Video clip pending" />
              )}
            </div>
            {t.meta && (
              <p
                className="px-2 pb-1 pt-3 text-center text-[11px] font-bold uppercase tracking-[0.14em]"
                style={{ color: C.inkSoft }}
              >
                {t.meta}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
