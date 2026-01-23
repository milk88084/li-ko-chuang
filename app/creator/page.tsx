'use client';

import dynamic from 'next/dynamic';

const CreatorContent = dynamic(
  () => import('@/components/CreatorContent').then((mod) => mod.CreatorContent),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    ),
  }
);

export default function CreatorPage() {
  return <CreatorContent />;
}
