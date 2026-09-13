/**
 * The article template's own words, in each language a post can be read in.
 *
 * Added 14 September 2026 with the Spanish blog. Posts are localized in
 * Strapi (see cms/src/api/post/content-types/post/schema.json), but the
 * labels the template draws around a post - "Key takeaways", the facts
 * column, the inline call to action, the author bio - are the site's, so they
 * live here rather than in the CMS.
 *
 * Only the blog is translated. The header, footer, breadcrumbs and the closing
 * call to action stay English on a Spanish article, which was agreed as fine
 * for a blog-only rollout. This file covers the words inside the article
 * template and nothing wider.
 *
 * !! THE SPANISH IS NEUTRAL LATIN AMERICAN, ADDRESSING THE READER AS USTED !!
 *
 * The choice made for the translated posts themselves, so the frame matches
 * the article inside it. A new language adds a key to PostLocale and an entry
 * below; TypeScript refuses to build until every label has a value.
 */

export type PostLocale = "en" | "es";

export const POST_LOCALES: readonly PostLocale[] = ["en", "es"];

/**
 * Where a language's articles live. English keeps the unprefixed /blog it has
 * always had, so no existing URL moves; every other language is prefixed.
 */
export function blogBase(locale: PostLocale): string {
  return locale === "en" ? "/blog" : `/${locale}/blog`;
}

type PostLabels = {
  keyTakeaways: string;
  onThisPage: string;
  author: string;
  published: string;
  updated: string;
  readTime: string;
  minutes: (n: number) => string;
  commonQuestions: string;
  readNext: string;
  serviceBehind: string;
  ctaHeading: string;
  ctaBody: string;
  ctaButton: string;
  founderBio: string;
  companyBio: (siteName: string) => string;
  /** For toLocaleDateString. */
  dateLocale: string;
  /** For Open Graph. */
  ogLocale: string;
};

export const postLabels: Record<PostLocale, PostLabels> = {
  en: {
    keyTakeaways: "Key takeaways",
    onThisPage: "On this page",
    author: "Author",
    published: "Published",
    updated: "Updated",
    readTime: "Read time",
    minutes: (n) => `${n} min`,
    commonQuestions: "Common questions",
    readNext: "Read next",
    serviceBehind: "The service behind this",
    ctaHeading: "Wondering what this would take against your own systems?",
    ctaBody:
      "The audit costs nothing, and you keep the costed plan and the risks whether you go ahead or not.",
    ctaButton: "Book a free automation audit",
    founderBio:
      "I am a startup veteran who has built five brands. I sold the first, an SEO tool, for a six figure exit, and now build AI automation products for businesses. I bootstrapped every one of them from day one.",
    companyBio: (siteName) =>
      `${siteName} has built software since 2008, for companies that mostly do not have an IT department. These pieces are written by the people who do the integrations rather than by anybody in marketing.`,
    dateLocale: "en-GB",
    ogLocale: "en_GB",
  },
  es: {
    keyTakeaways: "Puntos clave",
    onThisPage: "En esta página",
    author: "Autor",
    published: "Publicado",
    updated: "Actualizado",
    readTime: "Tiempo de lectura",
    minutes: (n) => `${n} min`,
    commonQuestions: "Preguntas frecuentes",
    readNext: "Siguiente lectura",
    serviceBehind: "El servicio detrás de esto",
    ctaHeading: "¿Qué implicaría esto en sus propios sistemas?",
    ctaBody:
      "La auditoría no tiene costo, y usted conserva el plan con costos y los riesgos identificados, decida avanzar o no.",
    ctaButton: "Reserve una auditoría de automatización gratuita",
    founderBio:
      "Soy un emprendedor que ha creado cinco marcas. Vendí la primera, una herramienta de SEO, en una operación de seis cifras, y hoy creo productos de automatización con IA para empresas. Financié cada una con recursos propios desde el primer día.",
    companyBio: (siteName) =>
      `${siteName} desarrolla software desde 2008 para empresas que, en su mayoría, no tienen un departamento de TI. Estos artículos los escriben las personas que hacen las integraciones, no el equipo de marketing.`,
    dateLocale: "es-419",
    ogLocale: "es_LA",
  },
};
