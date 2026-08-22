import { siloRoute } from "@/lib/silo-route";

/* Copy and metadata live in content/. See lib/silo-route.tsx. */
const route = siloRoute("/services/financial-data-automation");

export const metadata = route.metadata;
export default route.Page;
