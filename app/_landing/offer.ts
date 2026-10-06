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
/** The anchor the announcement bar named on the paid funnel. Kept, unrendered. */
export const PRICE_RISES_TO = '₹1699';
export const START_DATE = '12th October 2026';
export const SESSION_TIMES = '7 AM - 8 AM IST';
/**
 * One batch only on this challenge, so the "with timezone" variant is the same
 * string as SESSION_TIMES. Both exports stay, because the checkout, the
 * thank-you page and the terms all read the TZ one and a single batch today
 * does not mean a single batch on the next cohort.
 */
export const SESSION_TIMES_TZ = '7 AM - 8 AM IST';

/**
 * The figure in the hero proof strip. Supplied by Atul 2026-09-18, replacing
 * the source copy's "#,###+" placeholder, which was rendered verbatim until
 * then so it could never ship invisibly.
 *
 * It is a claim about real people, so it is stated as a floor ("100+") rather
 * than a precise count nobody can evidence.
 */
export const WOMEN_SUPPORTED = '100+';
/** The label this project actually uses for the same figure. One declaration,
 *  so the two can never disagree. */
export const LIVES_IMPACTED = WOMEN_SUPPORTED;

/**
 * The WhatsApp community invite. The thank-you page is built around joining it
 * as the single next step, and on this funnel the group is also a paid
 * deliverable ("The S.T.A.R.T. Right Inner Circle", listed at ₹997 value), so
 * an empty value here is a missing product, not just a missing link.
 *
 * ⚠️ REQUIRED BEFORE LAUNCH. Create the group, take the invite link.
 */
export const WHATSAPP_INVITE = process.env.NEXT_PUBLIC_WHATSAPP_INVITE ?? '';

/**
 * FREE FUNNEL (2026-10-06). The challenge is now free to join: Ads > Landing >
 * CTA opens the registration modal > /thank-you. Nothing on the page asks for
 * a payment any more.
 *
 * The price constants above are KEPT on purpose. The Razorpay routes, the
 * webhook and the CAPI value fields still read them, and the paid funnel may
 * come back. They are simply no longer rendered.
 */
export const FREE_LABEL = 'FREE';

/**
 * Every CTA on the page points here. It is a hash, not a route: the
 * registration modal (register-modal.tsx) catches the click on any [data-cta]
 * element and opens in place. Without JS the hash is a harmless no-op jump.
 *
 * The name is kept so the call sites did not all have to change.
 */
export const CHECKOUT_HREF = '#register';

/**
 * The CTA labels, standardised (2026-09-24). Every button on the page reads
 * from here, so a label change is one edit:
 *
 *   CTA_LABEL ........... the hero button and every other in-page button
 *   CTA_LABEL_RESERVE ... the button under the offer-card image in the hero
 *   CTA_LABEL_INSTANT ... the docked sticky bar, with STICKY_NOTE above it
 *
 * The reassurance line is a SINGLE line in the source, used under every button,
 * so CTA_NOTE and CTA_NOTE_HERO are deliberately the same string here.
 */
export const CTA_LABEL = 'Start Your 5-Day Reset • Join Free';
export const CTA_LABEL_INSTANT = 'Register For Free';
export const CTA_LABEL_RESERVE = 'Reserve My Free Spot';
export const STICKY_NOTE = `100% Free • Starts ${START_DATE}`;
export const CTA_NOTE = 'Free To Join · Limited Seats';
export const CTA_NOTE_HERO = CTA_NOTE;
