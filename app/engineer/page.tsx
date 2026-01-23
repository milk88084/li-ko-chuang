'use client';

import dynamic from 'next/dynamic';

const EngineerContent = dynamic(
  () => import('@/components/EngineerContent').then((mod) => mod.EngineerContent),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    ),
  }
);

export default function EngineerPage() {
  return <EngineerContent />;
}
