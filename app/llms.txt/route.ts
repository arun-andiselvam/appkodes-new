import { site, heroStats } from "@/content/site";
import { mainNav } from "@/content/navigation";
import { channels } from "@/content/contact";
import { llmsOverview, llmsDifferentiators, llmsOffer } from "@/content/llms";
import { siteOrigin } from "@/lib/site-url";

/**
 * /llms.txt — the llms.txt convention (llmstxt.org): a plain text file at
 * the site root giving a model a short, structured summary of what the site
 * is, rather than leaving it to infer one from rendered HTML.
 *
 * !! THE SERVICES AND INDUSTRIES SECTIONS ARE BUILT FROM mainNav, NOT TYPED HERE !!
 *
 * Same reasoning as app/sitemap.ts: "A hand-kept list here drifts from the
 * menu within about two pages." A service or industry page added to the
 * navigation is in this file the next time it is requested, with no second
 * place to remember to update. Only the prose in content/llms.ts — the
 * company description and the differentiators — is hand-authored, because
 * that is editorial judgement a nav tree cannot generate. See the note at
 * the top of that file for why each of those lines is worded the way it is.
 *
 * Route Handler rather than a static file in public/, matching how
 * robots.txt and sitemap.xml are already generated here rather than
 * committed as static files: the origin has to resolve per environment (see
 * lib/site-url.ts), and a static file cannot do that.
 */
export async function GET() {
  const origin = await siteOrigin();
  const abs = (path: string) => `${origin}${path}`;

  const servicesSilo = mainNav.find((item) => item.name === "Services");
  const industriesSilo = mainNav.find((item) => item.name === "Industries");

  const lines: string[] = [];

  lines.push(`# ${site.name}`, "");
  lines.push(`> ${llmsOverview[0]}`, "");
  // Built from heroStats rather than typed as prose, so a figure that
  // changes on the home page (heroStats is the source every page reads it
  // from) cannot drift out of sync with this file.
  lines.push(heroStats.map((stat) => `${stat.value} ${stat.label}`).join(". ") + ".");
  lines.push(llmsOverview[1], "");

  lines.push("## Services", "");
  for (const group of servicesSilo?.panel?.groups ?? []) {
    lines.push(`- [${group.name}](${abs(group.href)}): ${group.blurb}`);
    for (const child of group.children ?? []) {
      lines.push(`  - [${child.name}](${abs(child.href)}): ${child.blurb}`);
    }
  }
  lines.push("");

  lines.push("## Industries", "");
  for (const group of industriesSilo?.panel?.groups ?? []) {
    lines.push(`- [${group.name}](${abs(group.href)}): ${group.blurb}`);
  }
  lines.push("");

  lines.push("## Why Hitasoft", "");
  for (const item of llmsDifferentiators) {
    lines.push(`- **${item.title}**: ${item.body}`);
  }
  lines.push("");

  lines.push("## Getting started", "");
  lines.push(llmsOffer, "");

  lines.push("## More", "");
  lines.push(`- [How an engagement runs](${abs("/how-we-work")})`);
  lines.push(`- [Case studies](${abs("/resources/case-studies")})`);
  lines.push(`- [Resources](${abs("/resources")})`);
  lines.push(`- [Careers](${abs("/careers")})`);
  const email = channels.find((c) => c.label === "Email");
  lines.push(
    `- [Contact](${abs("/contact")})${email ? `: ${email.value}` : ""}`,
  );
  lines.push(`- [Full sitemap](${abs("/sitemap.xml")})`, "");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
