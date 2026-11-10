/**
 * Every date, time, price and destination on the page comes through this file.
 * Nothing below it should ever hard-code one again: when the cohort moves, one
 * edit here moves the announcement bar, the hero, the pills, the schedule
 * heading, the docked bar, the footer and the metadata together.
 */

/**
 * THE price. One number, from one env var, used by the copy, the GA4 event
 * values and the amount Razorpay actually charges. Nothing anywhere else may
 * declare a price: two sources drift, and the drift is invisible until the
 * charge and the label disagree on a live page.
 */
/* `??` does NOT catch an empty string, and .env.example now ships every key
   blank. So a copied-but-unfilled .env.local would give Number('') === 0: a
   page advertising ₹0 and a Razorpay order for zero paise, with nothing
   throwing. Guard on a positive number, not on null. */
const RAW_PRICE = Number(process.env.NEXT_PUBLIC_PRICE_RUPEES);
export const PRICE_RUPEES = Number.isFinite(RAW_PRICE) && RAW_PRICE > 0 ? RAW_PRICE : 497;
export const PRICE_PAISE = PRICE_RUPEES * 100;
export const PRICE = `₹${PRICE_RUPEES.toLocaleString('en-IN')}`;

export const WORKSHOP_NAME = '2-Day ‘Sleep Like You’re 2 Again’ Workshop';

/**
 * THE schedule. Two comma-separated lists, matched in order, so the first date
 * goes with the first time. Add or remove a pair and every page follows.
 *
 *   NEXT_PUBLIC_EVENT_DATES = 20th Nov, 21st Nov
 *   NEXT_PUBLIC_EVENT_TIMES = 7 PM, 11 AM
 *
 * `||`, not `??`, so a key defined blank still falls back to the values here.
 */
export const Event_Dates = process.env.NEXT_PUBLIC_EVENT_DATES || '20th Nov, 21st Nov';
export const Event_Times = process.env.NEXT_PUBLIC_EVENT_TIMES || '7 PM, 11 AM';

const toList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

/** "a", "a & b", "a, b & c". */
const joinList = (items: string[], last: string) =>
  items.length < 2
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} ${last} ${items[items.length - 1]}`;

const eventTimes = toList(Event_Times);

/* A date with no matching time shows TBA rather than borrowing another day's
   time, which would send someone to the wrong session. */
export const EVENTS = toList(Event_Dates).map((date, i) => ({
  day: i + 1,
  date,
  time: eventTimes[i] ?? 'Time TBA',
}));

/** "20th Nov & 21st Nov" */
export const WORKSHOP_DATES = joinList(
  EVENTS.map((e) => e.date),
  '&',
);
/** "20th Nov at 7 PM and 21st Nov at 11 AM" */
export const EVENT_SCHEDULE = joinList(
  EVENTS.map((e) => `${e.date} at ${e.time}`),
  'and',
);
/** "Day 1: 7 PM · Day 2: 11 AM" */
export const SESSION_TIMES = EVENTS.map((e) => `Day ${e.day}: ${e.time}`).join(' · ');

/**
 * The WhatsApp group invite. The thank-you page is built around joining it as
 * the single next step, because the joining links are shared there.
 *
 * ⚠️ REQUIRED BEFORE LAUNCH. Use an invite for THIS workshop's group.
 */
export const WHATSAPP_INVITE = process.env.NEXT_PUBLIC_WHATSAPP_INVITE ?? '';

/** The next click is a payment. Every CTA on the page, including the docked
 *  bar, points here. */
export const CHECKOUT_HREF = '/checkout';

/**
 * The CTA, standardised. The source sets it as two lines in one box, so every
 * button on the page reads both of these, and a label change is one edit.
 */
export const CTA_LABEL = 'Yes! I Want To Sleep Better';
export const CTA_SUBLABEL = `Join The Workshop at Just ${PRICE}`;
export const STICKY_NOTE = `Live Workshop • ${WORKSHOP_DATES}`;
