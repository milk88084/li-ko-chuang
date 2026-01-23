'use client';

import { Navigation } from '@/components/Navigation';
import { ThreeCanvas } from '@/components/ThreeCanvas';
import { MarketerView } from '@/components/MarketerView';
import { Footer } from '@/components/Footer';

export function MarketerContent() {
  return (
    <>
      <ThreeCanvas visualType="marketer" />
      <Navigation currentPage="marketer" />
      <div className="fade-in-up">
        <MarketerView />
      </div>
      <Footer currentPage="marketer" />
    </>
  );
}
