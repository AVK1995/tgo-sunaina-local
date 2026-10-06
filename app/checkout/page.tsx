import { redirect } from 'next/navigation';

/**
 * /checkout, retired by the free funnel (2026-10-06).
 *
 * There is nothing to pay for any more, so anyone holding an old checkout link
 * (an email, a retargeting ad, a bookmark) is sent to the landing page with the
 * registration modal already open. Their query string comes with them, so a
 * UTM-tagged link still attributes.
 *
 * The Razorpay checkout that lived here is in git history (commit 218e55d) and
 * the API routes it called are untouched, so the paid flow can be restored by
 * reverting this one file.
 */
export default function CheckoutPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === 'string') q.set(k, v);
    else if (Array.isArray(v) && v[0]) q.set(k, v[0]);
  }
  q.set('register', '1');
  redirect(`/?${q.toString()}`);
}
