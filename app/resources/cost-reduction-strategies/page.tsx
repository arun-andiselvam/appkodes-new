import { resourceCategoryRoute } from "@/lib/resource-category-route";

/* Page one. Copy lives in content/resources.ts, posts come from lib/posts.ts. */
const route = resourceCategoryRoute("/resources/cost-reduction-strategies");

export const metadata = route.metadata;
export default route.Page;
