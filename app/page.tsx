"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe } from "lucide-react";
import Matter from "matter-js";
import { useLanguage } from "@/providers/LanguageProvider";
import content from "@/data/content.json";

type ContentType = typeof content;
type LanguageKey = keyof ContentType;

// Safe hook for checking if component is mounted (avoids hydration mismatch)
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// 專業標籤數據 - variant: "filled" | "outlined"
const skillTags = [
  { id: 1, text: "ENGINEER", size: "lg", variant: "filled" },
  { id: 2, text: "MARKETER", size: "lg", variant: "outlined" },
  { id: 3, text: "CREATOR", size: "lg", variant: "filled" },
  { id: 4, text: "FULL STACK", size: "md", variant: "outlined" },
  { id: 5, text: "REACT", size: "sm", variant: "filled" },
  { id: 6, text: "NEXT.JS", size: "sm", variant: "outlined" },
  { id: 7, text: "GROWTH", size: "md", variant: "filled" },
  { id: 8, text: "UI/UX", size: "sm", variant: "outlined" },
  { id: 9, text: "TYPESCRIPT", size: "md", variant: "filled" },
  { id: 10, text: "BRANDING", size: "md", variant: "outlined" },
  { id: 11, text: "SEO", size: "sm", variant: "filled" },
  { id: 12, text: "DATA", size: "sm", variant: "outlined" },
];

// 導航項目 - 現在由 language context 決定

// 尺寸配置
const sizeConfig = {
  sm: { width: 80, height: 32, fontSize: "10px" },
  md: { width: 110, height: 38, fontSize: "12px" },
  lg: { width: 130, height: 44, fontSize: "14px" },
};

export default function Home() {
  const mounted = useIsMounted();
  const { resolvedTheme, setTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Map<number, Matter.Body>>(new Map());
  const [positions, setPositions] = useState<
    Map<number, { x: number; y: number; angle: number }>
  >(new Map());
  const [cursorStyle, setCursorStyle] = useState<"default" | "grab" | "grabbing">("default");

  // Only use theme after mounted to avoid hydration mismatch
  const isDark = mounted ? resolvedTheme === "dark" : false;
  
  // Get translated content
  const t = content[language as LanguageKey];
  
  // Navigation items with translations
  const navItems = [
    { id: "engineer", label: t.nav.engineer, href: "/engineer" },
    { id: "marketer", label: t.nav.marketer, href: "/marketer" },
    { id: "creator", label: t.nav.creator, href: "/creator" },
  ];

  useEffect(() => {
    if (!sceneRef.current || !mounted) return;

    const container = sceneRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1 },
    });
    engineRef.current = engine;

    // Create walls
    const wallThickness = 60;
    let walls = [
      Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width + 200, wallThickness, {
        isStatic: true,
        friction: 0.8,
        restitution: 0.3,
        label: "wall",
      }),
      Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, {
        isStatic: true,
        friction: 0.5,
        label: "wall",
      }),
      Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, {
        isStatic: true,
        friction: 0.5,
        label: "wall",
      }),
    ];
    Matter.Composite.add(engine.world, walls);

    // Create bodies for each tag
    const newBodies = new Map<number, Matter.Body>();
    skillTags.forEach((tag, index) => {
      const config = sizeConfig[tag.size as keyof typeof sizeConfig];
      const x = 100 + Math.random() * (width - 200);
      const y = -100 - index * 80 - Math.random() * 100;

      const body = Matter.Bodies.rectangle(x, y, config.width, config.height, {
        chamfer: { radius: config.height / 2 },
        friction: 0.3,
        frictionAir: 0.01,
        restitution: 0.6,
        density: 0.001,
        label: `tag-${tag.id}`,
      });

      Matter.Body.setAngle(body, (Math.random() - 0.5) * 0.5);
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 5,
        y: Math.random() * 2,
      });

      newBodies.set(tag.id, body);
      Matter.Composite.add(engine.world, body);
    });
    bodiesRef.current = newBodies;

    // Mouse setup
    const mouse = Matter.Mouse.create(container);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    Matter.Composite.add(engine.world, mouseConstraint);

    // Track dragging state
    let isDragging = false;

    // Start drag - only when mouse is over a tag body
    Matter.Events.on(mouseConstraint, "startdrag", (event) => {
      const eventBody = (event as unknown as { body: Matter.Body }).body;
      if (eventBody && eventBody.label?.startsWith("tag-")) {
        isDragging = true;
        setCursorStyle("grabbing");
      }
    });

    // End drag
    Matter.Events.on(mouseConstraint, "enddrag", () => {
      isDragging = false;
      setCursorStyle("default");
    });

    // Handle mouse click on empty space - bounce tags at similar X position
    const handleClick = (e: MouseEvent) => {
      if (isDragging) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Check if clicking on a tag body
      const bodiesAtPoint = Matter.Query.point(
        Matter.Composite.allBodies(engine.world),
        { x: mouseX, y: mouseY }
      );

      const clickedOnTag = bodiesAtPoint.some((b) => b.label?.startsWith("tag-"));

      // If not clicking on a tag, bounce tags at similar X position
      if (!clickedOnTag) {
        const xTolerance = 120;

        bodiesRef.current.forEach((body) => {
          const xDistance = Math.abs(body.position.x - mouseX);

          if (xDistance < xTolerance) {
            const forceMagnitude = Math.max(0, (xTolerance - xDistance) / xTolerance) * 0.15;

            Matter.Body.applyForce(body, body.position, {
              x: (Math.random() - 0.5) * forceMagnitude * 0.3,
              y: -forceMagnitude - 0.03,
            });

            Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.5);
          }
        });
      }
    };

    // Handle mouse move - update cursor when hovering over tags
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Check if mouse is over any tag body
      const bodiesAtPoint = Matter.Query.point(
        Matter.Composite.allBodies(engine.world),
        { x: mouseX, y: mouseY }
      );

      const isOverTag = bodiesAtPoint.some((b) => b.label?.startsWith("tag-"));
      setCursorStyle(isOverTag ? "grab" : "default");
    };

    container.addEventListener("click", handleClick);
    container.addEventListener("mousemove", handleMouseMove);

    // Update loop
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Animation frame for DOM updates
    let animationId: number;
    const updatePositions = () => {
      const newPositions = new Map<number, { x: number; y: number; angle: number }>();
      bodiesRef.current.forEach((body, id) => {
        newPositions.set(id, {
          x: body.position.x,
          y: body.position.y,
          angle: body.angle,
        });
      });
      setPositions(newPositions);
      animationId = requestAnimationFrame(updatePositions);
    };
    updatePositions();

    // Handle resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      Matter.Composite.remove(engine.world, walls);
      walls = [
        Matter.Bodies.rectangle(newWidth / 2, newHeight + wallThickness / 2, newWidth + 200, wallThickness, {
          isStatic: true,
          friction: 0.8,
          restitution: 0.3,
          label: "wall",
        }),
        Matter.Bodies.rectangle(-wallThickness / 2, newHeight / 2, wallThickness, newHeight * 2, {
          isStatic: true,
          friction: 0.5,
          label: "wall",
        }),
        Matter.Bodies.rectangle(newWidth + wallThickness / 2, newHeight / 2, wallThickness, newHeight * 2, {
          isStatic: true,
          friction: 0.5,
          label: "wall",
        }),
      ];
      Matter.Composite.add(engine.world, walls);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("click", handleClick);
      container.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, [mounted]);

  // Render a consistent initial state for SSR
  if (!mounted) {
    return (
      <main className="h-screen md:max-h-screen md:overflow-hidden relative overflow-hidden bg-[#FBFBFD] dark:bg-black transition-colors duration-300">
        {/* Navigation skeleton */}
        <nav className="fixed w-full top-0 z-50 backdrop-blur-md border-b bg-[#FBFBFD]/80 dark:bg-black/80 border-gray-100/50 dark:border-white/10 transition-all duration-300">
          <div className=" mx-auto px-6 h-16 flex items-center justify-between">
            <div className="font-semibold text-sm tracking-tight text-gray-900 dark:text-white opacity-0">
              Portfolio.
            </div>
          </div>
        </nav>

        {/* Main Title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center px-4">
            <h1 className="text-[15vw] md:text-[12vw] lg:text-[11vw] font-black leading-[0.85] tracking-[-0.04em] text-[#3250FE] opacity-0">
              LI KO
            </h1>
            <h1 className="text-[15vw] md:text-[12vw] lg:text-[11vw] font-black leading-[0.85] tracking-[-0.04em] text-[#3250FE] opacity-0">
              CHUANG
            </h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`h-screen md:max-h-screen md:overflow-hidden relative overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-black" : "bg-[#FBFBFD]"
      }`}
    >
      {/* Navigation - matching other pages style */}
      <nav
        className={`fixed w-full top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
          isDark
            ? "bg-black/80 border-white/10"
            : "bg-[#FBFBFD]/80 border-gray-100/50"
        }`}
      >
        <div className=" mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`font-semibold text-sm tracking-tight transition-opacity cursor-pointer hover:opacity-70 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t.common.portfolio}
          </Link>

          {/* Nav Links + Theme Toggle */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Page Switcher */}
            <div
              className={`flex items-center p-1 rounded-lg ${
                isDark ? "bg-white/10" : "bg-gray-100"
              }`}
            >
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`px-2 md:px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer ${
                    isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-colors cursor-pointer text-xs font-medium ${
                isDark 
                  ? "text-gray-300 hover:bg-white/10" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'en' ? 'EN' : '中'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
              }`}
              aria-label="Toggle Dark Mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-white" />
              ) : (
                <Moon className="w-4 h-4 text-gray-900" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="text-center px-4">
          <h1
            className="text-[15vw] md:text-[12vw] lg:text-[11vw] font-black leading-[0.85] tracking-[-0.04em] transition-all duration-1000 opacity-100 translate-y-0 text-[#3250FE]"
          >
            LI KO
          </h1>
          <h1
            className="text-[15vw] md:text-[12vw] lg:text-[11vw] font-black leading-[0.85] tracking-[-0.04em] transition-all duration-1000 delay-150 opacity-100 translate-y-0 text-[#3250FE]"
          >
            CHUANG
          </h1>
        </div>
      </div>

      {/* Physics Container - handles all mouse interactions */}
      <div
        ref={sceneRef}
        className="absolute inset-0 z-20"
        style={{ cursor: cursorStyle }}
      >
        {/* Render tags based on physics positions */}
        {skillTags.map((tag) => {
          const pos = positions.get(tag.id);
          if (!pos) return null;

          const config = sizeConfig[tag.size as keyof typeof sizeConfig];
          const isFilled = tag.variant === "filled";

          return (
            <div
              key={tag.id}
              className={`absolute font-medium tracking-wide rounded-full select-none pointer-events-none transition-colors duration-300 border-2 ${
                isFilled
                  ? "bg-[#3250FE] text-white border-[#3250FE]"
                  : "bg-transparent text-[#3250FE] border-[#3250FE]"
              }`}
              style={{
                left: pos.x,
                top: pos.y,
                width: config.width,
                height: config.height,
                fontSize: config.fontSize,
                transform: `translate(-50%, -50%) rotate(${pos.angle}rad)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isFilled
                  ? isDark
                    ? "0 4px 20px rgba(50, 80, 254, 0.4)"
                    : "0 4px 20px rgba(50, 80, 254, 0.25)"
                  : "none",
              }}
            >
              {tag.text}
            </div>
          );
        })}
      </div>

      {/* Bottom Info */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 px-4 py-4 md:px-10 md:py-6 pointer-events-none"
      >
        <div
          className={`max-w-[1600px] mx-auto flex justify-between items-end text-[9px] md:text-[11px] tracking-[0.15em] uppercase font-medium ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <span>{t.common.footerTitle}</span>
          <span className={`hidden md:block ${isDark ? "text-gray-600" : "text-gray-300"}`}>
            {t.common.footerSubtitle}
          </span>
          <span>{t.common.footerLocation}</span>
        </div>
      </div>

      {/* Instructions hint */}
      <div
        className={`absolute bottom-16 left-1/2 -translate-x-1/2 z-30 text-[10px] md:text-xs tracking-wider pointer-events-none ${
          isDark ? "text-gray-600" : "text-gray-400"
        }`}
      >
        {t.common.homeHint} ✨
      </div>
    </main>
  );
}
