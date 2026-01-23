'use client';

import dynamic from 'next/dynamic';

const MarketerContent = dynamic(
  () => import('@/components/MarketerContent').then((mod) => mod.MarketerContent),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    ),
  }
);

export default function MarketerPage() {
  return <MarketerContent />;
}
