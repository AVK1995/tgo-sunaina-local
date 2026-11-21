/**
 * What the buyer gets, and the one place it is defined. The landing page's
 * bonus section and the checkout summary both read from here, so the checkout
 * can never promise something the page did not.
 */
import { PRICE } from '../_landing/offer';

export const LEAD_ITEM = '2-Day Live ‘Sleep Like You’re 2 Again’ Workshop';

/** The two optional add-ons offered on the checkout, and their order-summary
 *  names. Prices come from offer.ts, never from here. */
export const BUMPS = {
  recordings: {
    badge: 'Recommended',
    title: 'Workshop Recordings: Day 1 + Day 2',
    summary: 'Workshop recordings (Day 1 & 2)',
    body: 'Join live, then keep both sessions to rewatch whenever your sleep needs a reset.',
    points: [
      'Full recording of Day 1: Win Your Nights',
      'Full recording of Day 2: Own Your Mornings',
      'Rewatch the breathing practices and gentle stretches at your own pace',
      'Shared in a separate recordings WhatsApp group',
      `Your live seat is still included in the ${PRICE}`,
    ],
  },
  call: {
    badge: 'One-on-one',
    title: 'Private 1-on-1 Call with Sunaina',
    summary: 'Private 1-on-1 call with Sunaina',
    body: 'Talk to Sunaina personally about your sleep and get guidance for your own routine.',
    points: [
      'A private call with Sunaina, not a group session',
      'Share what is keeping you awake and ask your questions directly',
      'Get suggestions for your own evening and morning routine',
      'Book a slot that suits you using the link you receive after registering',
    ],
  },
} as const;

export const BONUSES: { title: string; body: string }[] = [
  {
    title: 'The Deep Sleep Guided Meditation',
    body: 'Quiet your racing mind & prepare for peaceful sleep in just 15 minutes, with a calming guided audio you can use every night.',
  },
  {
    title: 'The 7-Day Better Sleep Reset Planner',
    body: "Take control of your sleep in just 7 days, with a step-by-step planner to build better habits, track your progress & identify what's keeping you awake.",
  },
  {
    title: 'The 10-Minute Morning Recharge Routine',
    body: 'Kickstart your mornings with more energy, focus & mental clarity, with a simple 10-minute routine you can follow from the comfort of your home.',
  },
];
