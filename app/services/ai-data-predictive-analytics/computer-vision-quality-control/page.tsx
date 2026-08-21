import { siloRoute } from "@/lib/silo-route";

/* Copy and metadata live in content/. See lib/silo-route.tsx. */
const route = siloRoute("/services/ai-data-predictive-analytics/computer-vision-quality-control");

export const metadata = route.metadata;
export default route.Page;
