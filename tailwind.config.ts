import type { Config } from 'tailwindcss';

/**
 * S.T.A.R.T. Right · 6-Day 'Start Your Morning Right' Challenge.
 *
 * SUNRISE skin. Warm ivory is the environment, deep plum is the structure,
 * apricot is the accent and sunrise coral is the CTA. This replaces the
 * inherited Kaizen palette outright: nothing navy or marigold survives.
 *
 * Third copy of one palette, after app/globals.css and app/_landing/shared.tsx.
 * All three move together. See design-system.project.md for the contrast maths
 * behind every value, and for the surface-vs-ink rule that governs the accents.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: { DEFAULT: '#FFFEFB', alt: '#F3F5FA' },
        /* ink = the navy headline. body = slate. soft = grey. */
        ink: { DEFAULT: '#26304A', body: '#2E3443', soft: '#5E6577' },
        plum: { DEFAULT: '#26304A', deeper: '#1D2539', bed: '#E8ECF4' },
        gold: {
          DEFAULT: '#F2B45F',
          pale: '#F5F0E8',
          wash: '#FDF0DC',
          mid: '#E0A44F',
          deep: '#A96F17',
          ink: '#8F5B0D',
        },
        coral: { DEFAULT: '#F0A35E', bed: '#FDF0E4', ink: '#A24E16' },
        rose: { bed: '#EEF2F8' },
        line: { DEFAULT: '#E5E8EF', strong: '#D2D8E3' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Inter', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { pill: '999px' },
      boxShadow: {
        /* Layered and tinted toward the brand PLUM, never a flat grey (C4).
           These were still tinted toward Kaizen's navy until this pass. */
        soft: '0 4px 20px -10px rgba(88,51,79,0.14)',
        card: '0 18px 44px -26px rgba(88,51,79,0.26)',
        lift: '0 2px 0 0 rgba(224,164,79,0.30), 0 22px 42px -22px rgba(88,51,79,0.34)',
      },
    },
  },
  plugins: [],
};

export default config;
