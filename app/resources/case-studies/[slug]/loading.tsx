import { PostSkeleton } from "@/components/sections/post-skeleton";

/*
 * A case study is a long read with artwork at the top, so it borrows the
 * article boundary rather than the listing one it would otherwise inherit
 * from app/resources/loading.tsx.
 */
export default function Loading() {
  return <PostSkeleton />;
}
