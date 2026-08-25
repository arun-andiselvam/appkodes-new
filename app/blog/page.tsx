import { pageMetadata } from "@/lib/seo";
import { BlogIndex } from "@/components/sections/blog-index";
import { CtaSection } from "@/components/sections/cta";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Every guide we have written on putting AI into software you already run, and on what the repeat work in a growing company costs.",
  path: "/blog",
});

/** Page one. Later pages live at /blog/page/<n>. See app/blog/page/[n]/. */
export default function BlogPage() {
  return (
    <main>
      <BlogIndex />
      <CtaSection />
    </main>
  );
}
