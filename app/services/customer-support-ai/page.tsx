import { siloRoute } from "@/lib/silo-route";

/* Copy and metadata live in content/. See lib/silo-route.tsx. */
const route = siloRoute("/services/customer-support-ai");

export const metadata = route.metadata;
export default route.Page;
