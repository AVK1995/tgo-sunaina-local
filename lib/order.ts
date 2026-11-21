import {
  CALL_BOOKING_URL,
  CALL_PRICE_RUPEES,
  PRICE_RUPEES,
  RECORDING_PRICE_RUPEES,
  RECORDINGS_WHATSAPP_INVITE,
  WHATSAPP_INVITE,
} from '@/app/_landing/offer';

/**
 * The four things a buyer can end up with, and everything that differs
 * between them. The checkout, the order route, the webhook, the thank-you
 * pages and the Pabbly payload all read from here, so a price, a link or a
 * page can never disagree between them.
 *
 * `order_type` is the value Pabbly routes on to choose which email and
 * WhatsApp confirmation to send.
 */
export type OrderType =
  | 'workshop'
  | 'workshop_recordings'
  | 'workshop_call'
  | 'workshop_recordings_call';

export const ORDER_TYPES: OrderType[] = [
  'workshop',
  'workshop_recordings',
  'workshop_call',
  'workshop_recordings_call',
];

export function orderTypeFor(recordings: boolean, call: boolean): OrderType {
  if (recordings && call) return 'workshop_recordings_call';
  if (recordings) return 'workshop_recordings';
  if (call) return 'workshop_call';
  return 'workshop';
}

/** Anything unrecognised is treated as the plain workshop, never as a bump. */
export function parseOrderType(value: unknown): OrderType {
  return ORDER_TYPES.includes(value as OrderType) ? (value as OrderType) : 'workshop';
}

export const hasRecordings = (t: OrderType) =>
  t === 'workshop_recordings' || t === 'workshop_recordings_call';
export const hasCall = (t: OrderType) => t === 'workshop_call' || t === 'workshop_recordings_call';

export type OrderBreakdown = {
  type: OrderType;
  baseAmount: number;
  recordingAmount: number; // 0 when not bought
  callAmount: number; // 0 when not bought
  totalAmount: number;
};

/** Priced from the CURRENT env values. The order route stores the result in
 *  the order itself, so a later price change cannot rewrite a past sale. */
export function priceOrder(type: OrderType): OrderBreakdown {
  const recordingAmount = hasRecordings(type) ? RECORDING_PRICE_RUPEES : 0;
  const callAmount = hasCall(type) ? CALL_PRICE_RUPEES : 0;
  return {
    type,
    baseAmount: PRICE_RUPEES,
    recordingAmount,
    callAmount,
    totalAmount: PRICE_RUPEES + recordingAmount + callAmount,
  };
}

/** The links a buyer of this type receives. Empty when not bought. */
export function orderLinks(type: OrderType) {
  return {
    workshopWhatsapp: WHATSAPP_INVITE,
    recordingsWhatsapp: hasRecordings(type) ? RECORDINGS_WHATSAPP_INVITE : '',
    callBooking: hasCall(type) ? CALL_BOOKING_URL : '',
  };
}

/** One thank-you page per order type. */
export const THANK_YOU_PATH: Record<OrderType, string> = {
  workshop: '/thank-you',
  workshop_recordings: '/thank-you/recordings',
  workshop_call: '/thank-you/private-call',
  workshop_recordings_call: '/thank-you/complete',
};
