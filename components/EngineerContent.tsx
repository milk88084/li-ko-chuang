'use client';

import { Navigation } from '@/components/Navigation';
import { ThreeCanvas } from '@/components/ThreeCanvas';
import { EngineerView } from '@/components/EngineerView';
import { Footer } from '@/components/Footer';

export function EngineerContent() {
  return (
    <>
      <ThreeCanvas visualType="engineer" />
      <Navigation currentPage="engineer" />
      <div className="fade-in-up">
        <EngineerView />
      </div>
      <Footer currentPage="engineer" />
    </>
  );
}
