'use client';

import Script from 'next/script';
import { useEffect } from 'react';

import { captureAttribution } from '@/lib/attribution';
import { captureFbclid } from '@/lib/client-signals';

/**
 * The Meta pixel base code and the ONE browser-side event we fire: PageView.
 *
 * Everything else (ViewContent, AddToCart, InitiateCheckout, Purchase) goes
 * server-side through the Conversions API, so Meta counts one source of truth
 * per event and browser auto-detection cannot inflate it. The free funnel's
 * atc_event and registration_complete are the exception: they fire from both
 * sides with a shared event id (see lib/pixel.ts).
 *
 * The init carries advanced matching: the browser's external_id (the same
 * `sr_external_id` lib/client-signals.ts sends to CAPI, created here if it
 * does not exist yet) and, after a registration, the visitor's normalised
 * details from `sr_am`. The pixel hashes them before sending.
 *
 * Renders nothing when the pixel id is absent, so a missing env var leaves no
 * broken script tag behind.
 */
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';

export default function MetaPixel() {
  /* Two captures, both on first landing, both on EVERY page rather than only
     the landing page: a retargeting ad or an email can drop someone straight
     onto /checkout, and that visit is the only one carrying the campaign.

     captureFbclid writes Meta's _fbc cookie from the url, exactly as the pixel
     would. captureAttribution stores the UTMs, the raw fbclid, the referrer
     and the landing url, which are gone from the url one click later and are
     what the Razorpay order and the Pabbly record are built from.

     This runs before the PIXEL_ID guard below on purpose: attribution must not
     go dark just because the pixel id is unset. */
  useEffect(() => {
    captureFbclid();
    captureAttribution();
  }, []);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
var am={};try{am=JSON.parse(localStorage.getItem('sr_am')||'{}')||{};
var x=localStorage.getItem('sr_external_id');if(!x){x=(window.crypto&&crypto.randomUUID)?
crypto.randomUUID():Date.now()+'-'+Math.random().toString(16).slice(2);
localStorage.setItem('sr_external_id',x);}am.external_id=x;}catch(e){}
fbq('init','${PIXEL_ID}',am);fbq('track','PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
