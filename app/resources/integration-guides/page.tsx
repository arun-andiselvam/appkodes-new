import { pageMetadata } from "@/lib/seo";
import { ResourceCategoryPage } from "@/components/sections/resource-category";
import { CtaSection } from "@/components/sections/cta";
import { resourceCategories } from "@/content/resources";

const path = "/resources/integration-guides";
const category = resourceCategories[path];

export const metadata = pageMetadata({
  title: category.metaTitle,
  description: category.metaDescription,
  path,
});

export default function Page() {
  return (
    <main>
      <ResourceCategoryPage path={path} category={category} />
      <CtaSection />
    </main>
  );
}
