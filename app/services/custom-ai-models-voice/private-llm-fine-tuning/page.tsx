import { siloRoute } from "@/lib/silo-route";

/* Copy and metadata live in content/. See lib/silo-route.tsx. */
const route = siloRoute("/services/custom-ai-models-voice/private-llm-fine-tuning");

export const metadata = route.metadata;
export default route.Page;
