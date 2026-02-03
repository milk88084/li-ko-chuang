"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
  title: string;
  subtitle: string;
  tech: string[];
  problem: string;
  outcome: string;
  metrics: string[];
}

interface ProjectTimelineProps {
  projects: Project[];
  problemLabel: string;
  outcomeLabel: string;
  techLabel: string;
  isDark?: boolean;
  activeProjectIndex?: number;
}

export function ProjectTimeline({
  projects,
  problemLabel,
  outcomeLabel,
  techLabel,
  isDark = false,
  activeProjectIndex,
}: ProjectTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeProject = projects[activeIndex];

  const handleProjectChange = (index: number) => {
    if (index === activeIndex || isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 400);
  };

  // Sync with external activeProjectIndex
  useEffect(() => {
    if (
      activeProjectIndex !== undefined &&
      activeProjectIndex !== activeIndex &&
      !isAnimating
    ) {
      setIsAnimating(true);
      setActiveIndex(activeProjectIndex);
      setTimeout(() => setIsAnimating(false), 400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProjectIndex]);

  const handlePrev = () => {
    if (activeIndex > 0) {
      handleProjectChange(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < projects.length - 1) {
      handleProjectChange(activeIndex + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  // Scroll active project into view
  useEffect(() => {
    if (itemRefs.current[activeIndex] && selectorRef.current) {
      const selector = selectorRef.current;
      const activeItem = itemRefs.current[activeIndex];

      const scrollLeft =
        activeItem!.offsetLeft -
        selector.offsetWidth / 2 +
        activeItem!.offsetWidth / 2;
      selector.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  // Mouse Drag to Scroll
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectorRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - selectorRef.current.offsetLeft);
    setScrollLeftState(selectorRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectorRef.current) return;
    e.preventDefault();
    const x = e.pageX - selectorRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    selectorRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <div className="w-full">
      {/* Project Selector - Horizontal scrollable on mobile */}
      <div className="relative mb-8">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all ${
            activeIndex === 0
              ? "opacity-30 cursor-not-allowed"
              : "opacity-100 hover:scale-110"
          } ${isDark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-900"}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          disabled={activeIndex === projects.length - 1}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all ${
            activeIndex === projects.length - 1
              ? "opacity-30 cursor-not-allowed"
              : "opacity-100 hover:scale-110"
          } ${isDark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-900"}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Project Cards */}
        <div
          ref={selectorRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex justify-start md:justify-center gap-3 px-12 overflow-x-auto scrollbar-hide py-2 scroll-smooth ${
            isDragging ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
        >
          {projects.map((project, index) => (
            <button
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              onClick={() => handleProjectChange(index)}
              className={`group relative shrink-0 px-5 py-3 rounded-xl transition-all duration-300 ${
                index === activeIndex
                  ? isDark
                    ? "bg-white text-black"
                    : "bg-gray-900 text-white"
                  : isDark
                    ? "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              <span className="text-sm font-medium whitespace-nowrap">
                {project.title}
              </span>
              {/* Active indicator */}
              {index === activeIndex && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Project Detail */}
      <div
        ref={contentRef}
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
          isDark ? "bg-[#1C1C1E] border-white/10" : "bg-white border-gray-100"
        }`}
      >
        <div
          className={`transition-all duration-400 ${
            isAnimating
              ? "opacity-0 translate-y-4"
              : "opacity-100 translate-y-0"
          }`}
        >
          {/* Header */}
          <div
            className={`p-6 md:p-8 border-b ${isDark ? "border-white/5" : "border-gray-100"}`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={`text-sm font-mono ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {String(activeIndex + 1).padStart(2, "0")} /{" "}
                    {String(projects.length).padStart(2, "0")}
                  </span>
                </div>
                <h3
                  className={`text-2xl md:text-3xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {activeProject.title}
                </h3>
                <p
                  className={`text-base mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {activeProject.subtitle}
                </p>
              </div>

              {/* Metrics */}
              <div className="flex flex-wrap gap-2">
                {activeProject.metrics.map((metric, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                      isDark
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Problem */}
              <div
                className={`rounded-xl p-5 ${isDark ? "bg-black/30" : "bg-gray-50"}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <h4
                    className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {problemLabel}
                  </h4>
                </div>
                <p
                  className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {activeProject.problem}
                </p>
              </div>

              {/* Outcome */}
              <div
                className={`rounded-xl p-5 ${isDark ? "bg-black/30" : "bg-gray-50"}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <h4
                    className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {outcomeLabel}
                  </h4>
                </div>
                <p
                  className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {activeProject.outcome}
                </p>
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h4
                className={`text-xs font-semibold uppercase tracking-wider mb-4 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {techLabel}
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeProject.tech.map((techItem, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      isDark
                        ? "bg-white/10 text-gray-300 hover:bg-white/20"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {techItem}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center gap-1.5 mt-6">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => handleProjectChange(index)}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? `w-8 ${isDark ? "bg-white" : "bg-gray-900"}`
                : `w-1.5 ${isDark ? "bg-white/20 hover:bg-white/40" : "bg-gray-300 hover:bg-gray-400"}`
            }`}
          />
        ))}
      </div>
    </div>
  );
}
