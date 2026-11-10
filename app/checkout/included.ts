/**
 * What the buyer gets, and the one place it is defined. The landing page's
 * bonus section and the checkout summary both read from here, so the checkout
 * can never promise something the page did not.
 */
export const LEAD_ITEM = '2-Day Live ‘Sleep Like You’re 2 Again’ Workshop';

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
