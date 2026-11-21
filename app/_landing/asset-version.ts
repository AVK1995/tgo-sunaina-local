/**
 * Cache-buster for artwork under /public.
 *
 * Replacing an image while keeping its filename does NOT get the new artwork
 * in front of anyone. The path is the cache key in three separate places: the
 * visitor's browser, the CDN edge, and Next's image optimizer, which stores the
 * resized and re-encoded copies against the source URL. All three keep serving
 * the old bytes, and the stale copy usually looks correct to whoever replaced
 * the file, because their own browser fetched it fresh. It is a bug that only
 * ever appears on someone else's device.
 *
 * So every replaced asset gets a new URL instead. Bump this ONE value in the
 * same pass as any artwork swap and every reference moves together.
 *
 * v1: nothing in /public yet.
 * v2: the seven deliverable mockups (/public/mockups), the coach photography
 *     (/public/coach) and the square brand lockup (/public/brand) all landed
 *     on 4 Sep 2026. One bump covers the lot: they were all NEW paths, so each
 *     already carried a unique cache key. The next bump is owed the first time
 *     a file is replaced IN PLACE under a name that has already shipped.
 * v3: the transparent logo landed (4 Sep 2026). The lockup, the monogram cut
 *     from it and the favicons are all new paths, but the bump is owed anyway:
 *     the two coach photographs were renamed IN PLACE, so /coach/detail-close
 *     now serves different bytes than the name has already served.
 * v4: the eight benefit photos (/public/workshop/benefits) were cropped IN
 *     PLACE to 1200x720 to drop the label pills baked into their bottom edge
 *     (21 Nov 2026). The badges are now real text laid over the photo.
 * v5: four benefit photos (rest, unwind-fall-asleep, unwind-natural-habits,
 *     unwind-focus) replaced IN PLACE with new artwork (21 Nov 2026).
 * v6: the other four (balance, heart, recover, energize) replaced IN PLACE
 *     with the icon versions of their artwork (21 Nov 2026).
 */
export const ASSET_V = '6';

/** Appends the version to a /public path. Pass through unchanged if there is
 *  nothing to version, so a null slot stays a placeholder. */
export const asset = (path: string) => `${path}?v=${ASSET_V}`;
