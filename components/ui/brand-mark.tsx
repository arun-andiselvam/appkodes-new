import {
  siClaude, siGooglegemini, siMeta, siMistralai, siQwen, siDeepseek,
  siPython, siTypescript, siLaravel, siReact, siPostgresql, siRedis,
  siN8n, siModelcontextprotocol, siDocker, siFlutter, siStripe,
  siCursor, siGithubcopilot, siV0, siVercel, siGithubactions, siSentry,
  // Added 21 August 2026 for the fintech industry page's ecosystem section.
  // Plaid and Salesforce are not in simple-icons, so they fall back to a
  // monogram like OpenAI does.
  siQuickbooks, siXero, siMysql,
} from "simple-icons";

/**
 * Only the marks actually used, imported by name.
 *
 * simple-icons ships over three thousand icons and sets sideEffects false, so
 * named imports drop the rest at build time. Reaching into the package by a
 * computed key would defeat that and pull the whole set into the client
 * bundle, which is why the lookup is this hand written map rather than an
 * index access on the module.
 *
 * Adding a mark means adding it in both places, the import and the array.
 */
const BRAND_PATHS: Record<string, string> = Object.fromEntries(
  [
    ["siClaude", siClaude], ["siGooglegemini", siGooglegemini], ["siMeta", siMeta],
    ["siMistralai", siMistralai], ["siQwen", siQwen], ["siDeepseek", siDeepseek],
    ["siPython", siPython], ["siTypescript", siTypescript], ["siLaravel", siLaravel],
    ["siReact", siReact], ["siPostgresql", siPostgresql], ["siRedis", siRedis],
    ["siN8n", siN8n], ["siModelcontextprotocol", siModelcontextprotocol],
    ["siDocker", siDocker], ["siFlutter", siFlutter], ["siStripe", siStripe],
    ["siCursor", siCursor], ["siGithubcopilot", siGithubcopilot], ["siV0", siV0],
    ["siVercel", siVercel], ["siGithubactions", siGithubactions], ["siSentry", siSentry],
    ["siQuickbooks", siQuickbooks], ["siXero", siXero], ["siMysql", siMysql],
  ].map(([key, icon]) => [key as string, (icon as { path: string }).path]),
);

/**
 * The logo, or a monogram when there is no logo to use.
 *
 * Lifted out of components/sections/integrations.tsx on 21 August 2026, when
 * the service page stack section needed the same treatment. Two copies of the
 * map would drift, and the second one would inevitably be the one missing a
 * mark somebody had just added.
 *
 * No "use client" here. Nothing in this file holds state, so it renders on the
 * server for the service page and still bundles cleanly into the client for
 * the marquee.
 *
 * Marks render in currentColor rather than brand colour. Two dozen palettes
 * across a page would fight everything around them, and a single tone keeps
 * the name doing the reading while the mark works as texture. It also means
 * dark mode needs no second set of assets.
 *
 * Several entries have no mark. Some are capabilities rather than companies,
 * and some belong to brands that have had their icons pulled from the set,
 * OpenAI among them. They get a lettered box at the same size, never a stand
 * in logo, because borrowing another company's mark is the kind of small lie
 * this site has already had to clean up once.
 */
export function BrandMark({
  icon,
  name,
  className,
}: {
  icon?: string;
  name: string;
  className?: string;
}) {
  const path = icon ? BRAND_PATHS[icon] : undefined;
  const shared =
    className ??
    "shrink-0 w-5 h-5 mt-1 text-muted-foreground group-hover:text-foreground transition-colors";

  if (!path) {
    return (
      <span
        aria-hidden="true"
        className={`${shared} border border-current/30 flex items-center justify-center text-[10px] font-mono leading-none`}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${shared} fill-current`}>
      <path d={path} />
    </svg>
  );
}
