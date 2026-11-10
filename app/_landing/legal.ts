/**
 * The business facts every legal page needs.
 *
 * FILLED (31 Aug 2026). No field renders as a placeholder any more, so the
 * policy pages and the footer identity block are safe to show.
 *
 * TWO things are still worth confirming before this takes money, both marked
 * with a warning below and neither visible on the page: the PIN code is missing
 * from `address`, and `entity` must match the PAN record exactly. A policy
 * naming the wrong entity is worse than no policy.
 *
 * The values are collected here rather than scattered through three pages so it
 * is one edit, and so a placeholder cannot hide in a paragraph.
 *
 * They render on the page as written, so an unfilled one is visible to anyone
 * who opens the privacy policy rather than buried in a file nobody reads.
 *
 * `entity` and `tradeName` are TWO fields, not one, and both are needed before
 * the pages read correctly. Most of these clients are sole proprietorships,
 * which have no separate legal person: the individual IS the entity and is
 * what appears on the PAN and GST record, while the business name is what the
 * buyer recognises. The law wants the person named; the page wants the brand.
 * Collapsing them into one field gets one of the two audiences wrong, so ask
 * which structure the business actually is before filling either.
 */
export const LEGAL = {
  /** The registered entity. Confirmed a SOLE PROPRIETORSHIP, which has no
   *  separate legal person: the proprietor IS the entity, and the business
   *  name is only a trading name. So this is her own name and `tradeName`
   *  carries the brand. Everything renders as
   *  "Sunaina Setia, trading as START RIGHT, Daily dose of wellness", which is
   *  the correct formulation for the structure.
   *
   *  Taken from COPY-SOURCE.md ("Who is Sunaina Setia"), the client's own
   *  approved copy, rather than invented.
   *  ⚠️ Must match the PAN record EXACTLY: a middle name, a different spelling
   *  or a reversed order all make this the wrong person in a contract. Cheap to
   *  check, expensive to get wrong. */
  entity: 'Sunaina Setia',

  /** The registered trading name, used wherever the law wants "trading as".
   *  Confirmed as START RIGHT, which lines up with the S.T.A.R.T. method the
   *  whole funnel is built on. */
  tradeName: 'START RIGHT, Daily dose of wellness',

  /** ⚠️ INCOMPLETE: no PIN code was supplied, and "Haryana" is inferred from
   *  Gurgaon rather than given. Razorpay's merchant review and the refund
   *  policy both want a full postal address, so append the 6-digit PIN before
   *  this goes live. */
  address: 'START RIGHT, Daily dose of wellness, Gurgaon Phase 2, Gurgaon, Haryana',

  /** Razorpay's merchant review looks for the registered name, a postal
   *  address and a working phone plus email on the SITE itself, not only
   *  inside a policy page. SiteFooter carries all four. */
  phone: '+91 85059 11337',
  /** The same number, digits and leading + only, for the tel: href. */
  phoneHref: '+918505911337',

  /** The monitored inbox. Refund requests and data-deletion requests both land
   *  here, and both carry a statutory reply window, so it has to be an address
   *  someone actually reads. Interpolated into six mailto: links across the
   *  three policy pages and the footer. */
  email: 'startright.wellness@gmail.com',

  /** The seat of the district court covering the registered address. Gurgaon
   *  sits in the Gurugram judicial district.
   *  ⚠️ Inferred from the address, not supplied. Confirm before publishing if
   *  a specific forum is preferred. */
  jurisdiction: 'Gurugram, Haryana',

  /** ⚠️ Set to the date these were written. It must match the date the pages
   *  actually go live, so bump it on launch day if that slips. */
  effectiveDate: '31 August 2026',

  /** The funnel-facing name, verbatim from COPY-SOURCE.md. Deliberately NOT
   *  the same string as `tradeName`: the page sells the method, the policies
   *  name the business. Change this only if the copy source changes. */
  brand: 'S.T.A.R.T. Right',
  product: '2-Day ‘Sleep Like You’re 2 Again’ Workshop',
} as const;
