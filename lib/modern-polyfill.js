/**
 * Deliberately empty.
 *
 * Aliased over next/dist/build/polyfills/polyfill-module in next.config.mjs.
 * That module is Next.js's own fallback for browsers old enough to lack
 * Array.prototype.at/flat/flatMap, Object.hasOwn and a handful of other
 * methods every browser browserslist.json in this repo actually targets has
 * had natively since 2019-2020. It ships unconditionally, with no feature
 * detection, regardless of the browserslist field: a real Next.js gap, not
 * a misconfiguration on this repo's part. See next.config.mjs for the full
 * reasoning and the trade-off this makes.
 */
export {};
