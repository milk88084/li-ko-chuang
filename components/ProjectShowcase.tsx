'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronRight, Monitor, Smartphone, ExternalLink } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  description: string;
  tech: string[];
  color: string;
  image: string;
  link: string;
}

interface ProjectShowcaseProps {
  projects: Project[];
  nextProjectLabel: string;
  viewProjectLabel: string;
  isDark?: boolean;
}

export function ProjectShowcase({ 
  projects, 
  nextProjectLabel, 
  viewProjectLabel,
  isDark = false 
}: ProjectShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile'>('desktop');
  const [progress, setProgress] = useState(0);

  const currentProject = projects[currentIndex];

  const nextProject = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    setProgress(0);
  }, [projects.length]);

  const goToProject = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  // Auto-play functionality
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextProject();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [nextProject]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
        {/* Device Frame */}
        <div className="flex-1 flex justify-center items-center order-1 lg:order-1">
          <div className="relative">
            {deviceType === 'desktop' ? (
              // Desktop Frame
              <div className="relative">
                <div 
                  className={`w-[320px] md:w-[480px] lg:w-[560px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${
                    isDark ? 'bg-[#1C1C1E]' : 'bg-gray-900'
                  }`}
                >
                  {/* Browser Header */}
                  <div className={`h-8 md:h-10 flex items-center px-4 gap-2 ${isDark ? 'bg-[#2C2C2E]' : 'bg-gray-800'}`}>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500"></div>
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className={`flex-1 mx-4 h-5 md:h-6 rounded-md ${isDark ? 'bg-[#3C3C3E]' : 'bg-gray-700'}`}></div>
                  </div>
                  {/* Screen Content */}
                  <div className="aspect-16/10 relative overflow-hidden">
                    <Image
                      src={currentProject.image}
                      alt={currentProject.name}
                      fill
                      className="object-cover transition-all duration-700"
                      style={{ 
                        filter: `hue-rotate(${currentIndex * 30}deg)` 
                      }}
                    />
                    {/* Overlay with project color */}
                    <div 
                      className="absolute inset-0 opacity-10 transition-colors duration-500"
                      style={{ backgroundColor: currentProject.color }}
                    ></div>
                  </div>
                </div>
                {/* Desktop Stand */}
                <div className={`w-24 md:w-32 h-6 md:h-8 mx-auto rounded-b-lg ${isDark ? 'bg-[#2C2C2E]' : 'bg-gray-800'}`}></div>
                <div className={`w-40 md:w-48 h-2 md:h-3 mx-auto rounded-full ${isDark ? 'bg-[#2C2C2E]' : 'bg-gray-800'}`}></div>
              </div>
            ) : (
              // Mobile Frame
              <div 
                className={`w-[200px] md:w-[240px] rounded-[2.5rem] p-2 md:p-3 shadow-2xl transition-all duration-500 ${
                  isDark ? 'bg-[#1C1C1E]' : 'bg-gray-900'
                }`}
              >
                {/* Notch */}
                <div className="relative">
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-20 md:w-24 h-5 md:h-6 rounded-b-2xl z-10 ${isDark ? 'bg-[#1C1C1E]' : 'bg-gray-900'}`}></div>
                  {/* Screen Content */}
                  <div className="aspect-9/19 rounded-4xl overflow-hidden relative">
                    <Image
                      src={currentProject.image}
                      alt={currentProject.name}
                      fill
                      className="object-cover transition-all duration-700"
                      style={{ 
                        filter: `hue-rotate(${currentIndex * 30}deg)` 
                      }}
                    />
                    {/* Overlay with project color */}
                    <div 
                      className="absolute inset-0 opacity-10 transition-colors duration-500"
                      style={{ backgroundColor: currentProject.color }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project Info */}
        <div className="flex-1 order-2 lg:order-2 text-center lg:text-left">
          {/* Project Number */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <span 
              className="text-5xl md:text-6xl font-bold transition-colors duration-500"
              style={{ color: currentProject.color }}
            >
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              / {String(projects.length).padStart(2, '0')}
            </span>
          </div>

          {/* Project Name */}
          <h3 className={`text-2xl md:text-3xl font-bold mb-3 transition-all duration-500 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {currentProject.name}
          </h3>

          {/* Project Description */}
          <p className={`text-base md:text-lg mb-6 font-light ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {currentProject.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8">
            {currentProject.tech.map((tech, i) => (
              <span 
                key={i}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                  isDark 
                    ? 'bg-white/10 text-gray-300' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Progress Bar */}
          <div className={`h-1 rounded-full mb-6 overflow-hidden ${
            isDark ? 'bg-white/10' : 'bg-gray-200'
          }`}>
            <div 
              className="h-full transition-all duration-100 rounded-full"
              style={{ 
                width: `${progress}%`,
                backgroundColor: currentProject.color 
              }}
            ></div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            {/* Device Toggle */}
            <div className={`flex rounded-full p-1 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
              <button
                onClick={() => setDeviceType('desktop')}
                className={`p-2 rounded-full transition-all ${
                  deviceType === 'desktop'
                    ? isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
                aria-label="Desktop view"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceType('mobile')}
                className={`p-2 rounded-full transition-all ${
                  deviceType === 'mobile'
                    ? isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
                aria-label="Mobile view"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Next Project */}
            <button
              onClick={nextProject}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all hover:scale-105 ${
                isDark 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {nextProjectLabel}
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* View Project */}
            <a
              href={currentProject.link}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all hover:scale-105 border ${
                isDark 
                  ? 'border-white/20 text-white hover:bg-white/10' 
                  : 'border-gray-300 text-gray-900 hover:bg-gray-100'
              }`}
            >
              {viewProjectLabel}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Project Dots */}
          <div className="flex gap-2 mt-8 justify-center lg:justify-start">
            {projects.map((project, index) => (
              <button
                key={project.id}
                onClick={() => goToProject(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8' 
                    : isDark ? 'bg-white/20 hover:bg-white/40' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                style={{
                  backgroundColor: index === currentIndex ? project.color : undefined
                }}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
