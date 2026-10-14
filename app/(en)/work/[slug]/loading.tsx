import { PageLoading } from "@/components/layout/PageLoading";

// Moving between projects (or in from /work) only changes this segment, so
// the locale-level loading.tsx above never re-suspends — this one does.
export default function Loading() {
  return <PageLoading />;
}
