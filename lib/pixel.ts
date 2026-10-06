'use client';

/**
 * Browser-pixel half of the free funnel's two events.
 *
 * The paid funnel sent everything but PageView server-side only. The free
 * funnel's events (atc_event, registration_complete) go out from BOTH sides
 * with one shared event id: the pixel contributes the browser's own cookies
 * and device context, CAPI contributes the hashed form data and the IP, and
 * Meta merges the pair into one event with the union of their match keys.
 * That union is what pushes Event Match Quality up.
 *
 * Advanced matching: once someone registers, their normalised details are
 * kept in this browser (AM_KEY) and handed to fbq('init') by MetaPixel on
 * every later page load, so the pixel copy of registration_complete on
 * /thank-you, and any later visit, carries em / ph / fn / ln / ct / country /
 * external_id. The pixel hashes them itself before they leave the browser.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Read by the inline init in components/MetaPixel.tsx. Keep the two in step. */
export const AM_KEY = 'sr_am';

const PENDING_KEY = 'sr_pending_registration';

export function newEventId(prefix: string): string {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${id}`.replace(/[^A-Za-z0-9_-]/g, '');
}

/**
 * fbq is loaded afterInteractive, so a click (or the thank-you mount) can beat
 * it. Wait up to ~6s for it rather than dropping the event; the CAPI copy is
 * already on its way regardless.
 */
export function pixelTrackCustom(
  name: string,
  params: Record<string, unknown>,
  eventID: string,
) {
  if (typeof window === 'undefined') return;
  let tries = 0;
  const fire = () => {
    if (typeof window.fbq === 'function') {
      try {
        window.fbq('trackCustom', name, params, { eventID });
      } catch {
        /* never throw into a click */
      }
      return;
    }
    if (tries++ < 30) window.setTimeout(fire, 200);
  };
  fire();
}

export type MatchKeys = {
  email: string;
  phone: string; // E.164 digits, no plus
  firstName: string;
  lastName: string;
  city: string;
  country: string; // ISO-2
};

/** Normalised to Meta's rules, so the pixel's hashes equal CAPI's. */
export function rememberMatchKeys(p: MatchKeys) {
  const am = {
    em: p.email.trim().toLowerCase(),
    ph: p.phone.replace(/\D/g, ''),
    fn: p.firstName.trim().toLowerCase(),
    ln: p.lastName.trim().toLowerCase(),
    ct: p.city.trim().toLowerCase().replace(/[^a-z]/g, ''),
    country: p.country.trim().toLowerCase(),
  };
  try {
    window.localStorage.setItem(AM_KEY, JSON.stringify(am));
  } catch {
    /* storage blocked: the CAPI copy still carries every key */
  }
}

/** Hand-off from the modal to /thank-you, which fires the pixel copy. */
export function setPendingRegistration(eventId: string, occupation: string) {
  try {
    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify({ eventId, occupation }));
  } catch {
    /* ignore */
  }
}

export function takePendingRegistration(): { eventId: string; occupation: string } | null {
  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(PENDING_KEY);
    const v = JSON.parse(raw);
    return typeof v?.eventId === 'string' ? v : null;
  } catch {
    return null;
  }
}
