"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Project } from "@/lib/projects";

// A project as an image-led card: the cover fills the frame, the type and
// title sit underneath. Projects with a screen recording play it on hover
// (never on touch, never with reduced motion). The whole card is one link and
// drives the cursor's "View" state.

export function ProjectCard({
  project,
  href,
  typeLabel,
  aspect = "aspect-[16/10]",
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority = false,
}: {
  project: Project;
  href: string;
  typeLabel: string;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.play().catch(() => {});
  };

  const stop = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <Link
      href={href}
      data-cursor="view"
      onPointerEnter={(e) => e.pointerType === "mouse" && play()}
      onPointerLeave={stop}
      className="group block"
    >
      <div className={`relative overflow-hidden rounded-[10px] bg-surface ${aspect}`}>
        <Image
          src={project.cover}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {project.video && (
          <video
            ref={videoRef}
            src={project.video}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
      </div>
      <p className="mt-4 font-mono text-[11px] tracking-[0.04em] text-muted uppercase">
        {typeLabel}
        {project.category && ` · ${project.category}`}
      </p>
      <h3 className="mt-1.5 text-[19px] leading-snug tracking-[-0.01em] transition-colors group-hover:text-accent">
        {project.title}
      </h3>
    </Link>
  );
}
