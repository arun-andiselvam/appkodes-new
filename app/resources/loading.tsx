import { ListSkeleton } from "@/components/sections/list-skeleton";

/*
 * Covers /resources, both category pages under it and their paged archives.
 * A case study reads as an article rather than a list, so case-studies/[slug]
 * carries its own boundary and overrides this one.
 */
export default function Loading() {
  return <ListSkeleton />;
}
