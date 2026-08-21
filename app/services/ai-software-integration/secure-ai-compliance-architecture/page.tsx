import { siloRoute } from "@/lib/silo-route";

/* Copy and metadata live in content/. See lib/silo-route.tsx. */
const route = siloRoute("/services/ai-software-integration/secure-ai-compliance-architecture");

export const metadata = route.metadata;
export default route.Page;
