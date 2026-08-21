import { siloRoute } from "@/lib/silo-route";

/* Copy and metadata live in content/. See lib/silo-route.tsx. */
const route = siloRoute("/industries/marketing-and-adtech");

export const metadata = route.metadata;
export default route.Page;
