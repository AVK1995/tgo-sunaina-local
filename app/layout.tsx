import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';

import Analytics from '@/components/Analytics';
import MetaPixel from '@/components/MetaPixel';
import LegoObserver from './_landing/lego';
import { SESSION_TIMES, START_DATE } from './_landing/offer';
import './globals.css';

/**
 * Two faces, three voices.
 *
 * Plus Jakarta Sans (display) is a geometric humanist sans, set at 700 for
 * every title on the site. Display presence comes from WEIGHT and scale rather
 * than from a serif's stroke contrast, which is the trade this face makes.
 *
 * Inter (body) does the reading at 17px / 1.65, and everything that is not a
 * title: labels, eyebrows, buttons, UI numerals. The two share a humanist sans
 * skeleton, so they sit together without friction while staying distinct in
 * weight and temperament.
 *
 * The third voice, the "spec" one that labels and credentials use, is tracked
 * uppercase Inter 700 rather than a monospace. That is a deliberate exception to
 * the house three-voice rule: a mono reads clinical against a stillness,
 * breathwork and affirmations offer, and tracked caps do the same job in the
 * right register. Noted in design-system.project.md.
 */
/* Plus Jakarta Sans at 700, for titles. A geometric humanist sans: the display
   job here is carried by WEIGHT and scale rather than by a serif's contrast.

   Two weights, and only two. 700 is every title. 500 exists for exactly one
   element, the pull-quote in close.tsx, which is deliberately quieter than a
   heading and was set at medium long before this face arrived. The family is
   variable and could ship anything from 200 to 800; loading the two that are
   actually used keeps the payload honest and makes a synthesised weight
   impossible by construction.

   Every display element carries an explicit `font-bold` or `font-medium`, and
   `h1/h2/h3` set 700 in globals.css, so nothing can land on this face at a
   weight it was not loaded with. */
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const TITLE = "5-Day 'Start Your Morning Right' Challenge | S.T.A.R.T. Right";

const DESCRIPTION = `Five live, expert-guided mornings combining stillness, movement, affirmations, breathwork and connection, with Sunaina Setia. Starts ${START_DATE}, ${SESSION_TIMES}, live on Zoom. Free to join.`;

/* The live origin. Without a metadataBase Next resolves every share URL and
   every relative OG asset against localhost, so a link pasted into WhatsApp
   previews as a dead local address.

   This is deliberately defensive, because metadataBase is evaluated at BUILD
   time on every route including the generated /_not-found. A bad value here
   does not degrade the page, it fails the deploy:

     `??` does NOT catch an empty string. A host that defines the variable with
     a blank value (Vercel does exactly this when the key is added without one)
     gives new URL('') and ERR_INVALID_URL, which is what broke the Kaizen
     build.

   So: fall back on any falsy value rather than only on null, add the protocol
   if someone pastes a bare domain, and if it still will not parse, use the
   literal rather than throwing.

   ⚠️ PLACEHOLDER. The launch domain is not known yet, so FALLBACK_ORIGIN is
   still example.com. Replace it with the real origin, and keep it identical to
   `fallbackEventSourceUrl` in lib/checkout-config.ts. */
const FALLBACK_ORIGIN = 'https://example.com';

function resolveSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || '').trim();
  if (!raw) return FALLBACK_ORIGIN;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return FALLBACK_ORIGIN;
  }
}

const SITE_URL = resolveSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'S.T.A.R.T. Right',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#58334F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${jakarta.variable} ${inter.variable}`}>
      <body>
        {/* Marks the document as JS-capable BEFORE first paint, so the CSS
            scroll reveals only hide content when JS is there to reveal it.
            No-JS users and crawlers see everything, and there is no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('bw-js')",
          }}
        />
        {/* One set of observers for the whole document, mounted here rather
            than per-section. Renders nothing. */}
        <LegoObserver />
        <MetaPixel />
        {/* GA4 + Clarity, from env. Renders nothing until the ids are set.
            Without this the browser-side GA4 calls are silent no-ops and the
            webhook reports purchases with no funnel above them. */}
        <Analytics />
        {children}
      </body>
    </html>
  );
}
