import Link from 'next/link';

import BrandMark from '@/app/_landing/brand-mark';
import { LEGAL } from '@/app/_landing/legal';
import { C } from '@/app/_landing/shared';

/**
 * One footer for every page: landing, checkout and thank-you.
 *
 * Ankita runs two different footers (a dark one on the landing page and a
 * light ruled strip on the checkout) which means the disclaimer only appears
 * on some pages. Here it is a single dark component so the legal text and the
 * policy links are present wherever someone lands, including on a checkout
 * they reached from an ad.
 *
 * The brand mark is rendered HERE rather than passed in, which is what makes it
 * appear on the checkout and the thank-you page as well. It used to be part of
 * the landing page's colophon children, so those two pages had a footer with no
 * mark on it at all. `children` remains an optional slot beneath it for
 * page-specific detail (the landing page puts its cohort dates there).
 *
 * The disclaimer text is the CLIENT'S OWN WORDING, moved verbatim from the
 * Disclaimer block at the end of the source copy doc. It is legal copy: do not
 * reword it, and do not let it drift between pages, which is the whole reason
 * it lives in one component.
 */
export default function SiteFooter({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="px-4 py-10 sm:px-6 sm:py-12" style={{ background: C.plumDeep }}>
      <div className="mx-auto max-w-[1180px] text-center">
        <span className="mb-6 inline-flex">
          <BrandMark height={66} onDark />
        </span>

        {children}

        <p
          className="text-[11px] font-bold uppercase tracking-[0.22em]"
          style={{ color: C.gold }}
        >
          {LEGAL.brand} · {LEGAL.product}
        </p>

        <p
          className="mx-auto mt-5 max-w-4xl text-[12.5px] leading-relaxed sm:text-[13.5px]"
          style={{ color: 'rgba(255,249,241,0.65)' }}
        >
          All content, live sessions and resources provided as part of the
          {' '}{LEGAL.product} are for educational and general wellness
          purposes only. They are not medical, psychological or therapeutic
          advice and do not guarantee specific results. The workshop is not
          intended to diagnose, treat, cure or prevent any medical or mental
          health condition, or replace care from a qualified healthcare
          professional. Please consult an appropriate healthcare professional
          before beginning any new movement, yoga, breathwork or wellness
          practice, especially if you have an existing medical condition, injury
          or are currently undergoing treatment. Individual experiences and
          results may vary based on factors including health, lifestyle,
          attendance and consistency. This website is not affiliated with or
          endorsed by Meta. FACEBOOK and INSTAGRAM are trademarks of Meta
          Platforms, Inc.
        </p>

        {/* Operator identity and a reachable contact, on EVERY page. Razorpay's
            merchant review looks for the registered name, a postal address and
            a working phone plus email on the site itself, not only buried in a
            policy page, and a reviewer who cannot find them fails the account
            rather than writing to ask. */}
        <p
          className="mx-auto mt-6 max-w-3xl text-[12px] leading-relaxed sm:text-[12.5px]"
          style={{ color: 'rgba(255,249,241,0.55)' }}
        >
          {LEGAL.entity}, trading as {LEGAL.tradeName}
          <br />
          {LEGAL.address}
          <br />
          <a href={`mailto:${LEGAL.email}`} className="hover:underline">
            {LEGAL.email}
          </a>
          {' · '}
          <a href={`tel:${LEGAL.phoneHref}`} className="hover:underline">
            {LEGAL.phone}
          </a>
        </p>

        <p
          className="mt-4 text-[12px] sm:text-[13px]"
          style={{ color: 'rgba(255,249,241,0.55)' }}
        >
          © {new Date().getFullYear()} {LEGAL.brand}. All rights reserved.
        </p>

        <nav
          aria-label="Legal"
          className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[12px]"
          style={{ color: 'rgba(255,249,241,0.7)' }}
        >
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <span aria-hidden style={{ color: 'rgba(255,249,241,0.35)' }}>
            ·
          </span>
          <Link href="/terms-and-conditions" className="hover:underline">
            Terms and Conditions
          </Link>
          <span aria-hidden style={{ color: 'rgba(255,249,241,0.35)' }}>
            ·
          </span>
          <Link href="/refund-policy" className="hover:underline">
            Refund Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
