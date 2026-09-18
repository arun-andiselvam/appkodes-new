import { ListSkeleton } from "@/components/sections/list-skeleton";

/*
 * Covers /blog and /blog/page/<n>. Not /blog/<slug>, which has its own
 * boundary in [slug]/loading.tsx: a deeper loading.tsx wins over this one.
 */
export default function Loading() {
  return <ListSkeleton />;
}
