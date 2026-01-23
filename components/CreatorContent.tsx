'use client';

import { Navigation } from '@/components/Navigation';
import { ThreeCanvas } from '@/components/ThreeCanvas';
import { CreatorView } from '@/components/CreatorView';
import { Footer } from '@/components/Footer';

export function CreatorContent() {
  return (
    <>
      <ThreeCanvas visualType="creator" />
      <Navigation currentPage="creator" />
      <div className="fade-in-up">
        <CreatorView />
      </div>
      <Footer currentPage="creator" />
    </>
  );
}
