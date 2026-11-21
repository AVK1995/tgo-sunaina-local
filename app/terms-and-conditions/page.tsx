import type { Metadata } from 'next';
import Link from 'next/link';

import LegalPageLayout from '@/components/LegalPageLayout';

import { LEGAL } from '../_landing/legal';
import {
  CALL_PRICE_RUPEES,
  EVENT_SCHEDULE,
  PRICE,
  RECORDING_PRICE_RUPEES,
  rupees,
} from '../_landing/offer';

export const metadata: Metadata = {
  title: `Terms and Conditions | ${LEGAL.brand}`,
  description: `The terms that apply when you join the ${LEGAL.product}.`,
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms and Conditions"
      effectiveDate={LEGAL.effectiveDate}
      intro={`These terms apply when you buy or take part in the ${LEGAL.product}. By completing checkout you agree to them.`}
    >
      <h2>1. Who we are</h2>
      <p>
        The workshop is provided by {LEGAL.entity}, trading as{' '}
        {LEGAL.tradeName}, {LEGAL.address}.
      </p>

      <h2>2. What you are buying</h2>
      <p>
        Access to the {LEGAL.product}: live coach-led online sessions on{' '}
        {EVENT_SCHEDULE}, conducted in Hindi and English, together with the
        digital bonuses listed at checkout. The fee is {PRICE}.
      </p>
      <p>
        Two optional add-ons can be bought at checkout: the workshop recordings
        for Day 1 and Day 2 ({rupees(RECORDING_PRICE_RUPEES)}), shared in a
        separate WhatsApp group, and a private one-on-one call with Sunaina
        ({rupees(CALL_PRICE_RUPEES)}), booked through the link provided after
        purchase. You receive only the add-ons you paid for.
      </p>

      <h2>3. Sessions and scheduling</h2>
      <ul>
        <li>
          Sessions run live at the advertised times. Recordings are part of the
          workshop only for buyers of the recordings add-on. For everyone else,
          any recording made available is a courtesy and not guaranteed.
        </li>
        <li>
          We may move a session for reasons outside our control. Registered
          participants will be told as early as possible.
        </li>
        <li>You are responsible for your own internet access and device.</li>
      </ul>

      <h2>4. Health disclaimer</h2>
      <p>
        This workshop provides general wellness education covering sleep habits,
        breathing techniques, gentle stretches, mindfulness and bedtime and
        morning routines.{' '}
        <strong>
          It is not medical, psychological or therapeutic advice
        </strong>
        , it does not diagnose or treat any condition, and it is not a
        substitute for care from a qualified healthcare professional.
      </p>
      <p>
        Consult an appropriate healthcare professional before starting,
        particularly if you are pregnant, recovering from surgery or injury,
        taking prescribed medication, currently undergoing treatment, or living
        with a heart, joint, blood pressure or mental health condition. Stop
        immediately and seek medical help if you feel pain, dizziness or
        breathlessness. You take part at your own risk.
      </p>
      <p>
        If you take sleeping pills or any other prescribed medication, continue
        taking it as directed by your doctor.{' '}
        <strong>
          Never reduce or stop sleeping medication without medical guidance.
        </strong>
      </p>

      <h2>5. Your access</h2>
      <ul>
        <li>Access is personal to you and must not be shared or resold.</li>
        <li>
          Recording, redistributing or republishing any session or guide is not
          permitted.
        </li>
        <li>
          We may withdraw access without refund for abusive conduct toward staff
          or other participants.
        </li>
      </ul>

      <h2>6. Intellectual property</h2>
      <p>
        All session content, guides, recordings and materials remain the property
        of {LEGAL.entity}. You get a personal, non-transferable licence to use
        them for your own benefit.
      </p>

      <h2>7. Results</h2>
      <p>
        We describe what participants commonly notice. We do not promise a
        specific outcome, and results vary with individual circumstances,
        consistency and health status.
      </p>

      <h2>8. Payment and refunds</h2>
      <p>
        Payment is taken at checkout through our payment processor. Refunds are
        governed by our{' '}
        <Link href="/refund-policy">Refund Policy</Link>.
      </p>

      <h2>9. Liability</h2>
      <p>
        To the extent permitted by law, our total liability in connection with
        the workshop is limited to the amount you paid for it. Nothing in these
        terms limits liability that cannot lawfully be limited.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These terms are governed by the laws of India, and the courts of{' '}
        {LEGAL.jurisdiction} have exclusive jurisdiction.
      </p>

      <h2>11. Contact</h2>
      <p>
        {LEGAL.entity}, trading as {LEGAL.tradeName}, {LEGAL.address}.
        <br />
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
        {' · '}
        <a href={`tel:${LEGAL.phoneHref}`}>{LEGAL.phone}</a>
      </p>
    </LegalPageLayout>
  );
}
