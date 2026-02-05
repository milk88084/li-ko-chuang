"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

const skillTags = [
  { id: 1, text: "💻ENGINEER", zh: "💻工程師", size: "lg", variant: "filled" },
  { id: 2, text: "💼MARKETER", zh: "💼行銷人", size: "lg", variant: "filled" },
  { id: 3, text: "💡CREATOR", zh: "💡創作者", size: "lg", variant: "filled" },
  { id: 13, text: "🖌️DESIGNER", zh: "🖌️設計師", size: "lg", variant: "filled" },
  {
    id: 4,
    text: "SOCIAL MEDIA",
    zh: "自媒體經營者",
    size: "md",
    variant: "outlined",
  },
  { id: 5, text: "REACT", zh: "React", size: "md", variant: "outlined" },
  { id: 6, text: "NEXT.JS", zh: "Next.js", size: "md", variant: "outlined" },
  { id: 7, text: "GROWTH", zh: "成長", size: "sm", variant: "outlined" },
  { id: 8, text: "UI/UX", zh: "用戶體驗設計", size: "md", variant: "outlined" },
  {
    id: 9,
    text: "JAVASCRIPT",
    zh: "JavaScript",
    size: "md",
    variant: "outlined",
  },
  {
    id: 16,
    text: "TYPESCRIPT",
    zh: "TypeScript",
    size: "md",
    variant: "outlined",
  },
  { id: 10, text: "BRANDING", zh: "品牌行銷", size: "md", variant: "outlined" },
  { id: 17, text: "N8N", zh: "N8N", size: "md", variant: "outlined" },
  {
    id: 11,
    text: "PODCAST HOST",
    zh: "Podcast 主持人",
    size: "sm",
    variant: "outlined",
  },
  {
    id: 12,
    text: "VIBE CODING",
    zh: "Vibe Coding",
    size: "md",
    variant: "outlined",
  },
  {
    id: 14,
    text: "VIDEO EDITOR",
    zh: "影片剪輯",
    size: "md",
    variant: "outlined",
  },
  {
    id: 15,
    text: "OPEN MINDS",
    zh: "開放思維",
    size: "sm",
    variant: "outlined",
  },
];

const sizeConfig = {
  sm: { width: 80, height: 32, fontSize: "10px" },
  md: { width: 110, height: 38, fontSize: "12px" },
  lg: { width: 130, height: 44, fontSize: "14px" },
};

interface PhysicsBackgroundProps {
  language: string;
  isDark: boolean;
}

export default function PhysicsBackground({
  language,
  isDark,
}: PhysicsBackgroundProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Map<number, Matter.Body>>(new Map());
  const tagRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (!sceneRef.current) return;

    const container = sceneRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1 },
      enableSleeping: true,
    });
    engineRef.current = engine;

    const wallThickness = 60;
    let walls = [
      Matter.Bodies.rectangle(
        width / 2,
        height + wallThickness / 2,
        width + 200,
        wallThickness,
        { isStatic: true, friction: 0.8, restitution: 0.3 },
      ),
      Matter.Bodies.rectangle(
        -wallThickness / 2,
        height / 2,
        wallThickness,
        height * 2,
        { isStatic: true, friction: 0.5 },
      ),
      Matter.Bodies.rectangle(
        width + wallThickness / 2,
        height / 2,
        wallThickness,
        height * 2,
        { isStatic: true, friction: 0.5 },
      ),
    ];
    Matter.Composite.add(engine.world, walls);

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
      newBodies.set(tag.id, body);
      Matter.Composite.add(engine.world, body);
    });
    bodiesRef.current = newBodies;

    const mouse = Matter.Mouse.create(container);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Matter.Composite.add(engine.world, mouseConstraint);

    let isDragging = false;
    Matter.Events.on(mouseConstraint, "startdrag", (event) => {
      const { body } = event as Matter.IEvent<Matter.MouseConstraint> & {
        body: Matter.Body;
      };
      if (body && body.label?.startsWith("tag-")) {
        isDragging = true;
        container.style.cursor = "grabbing";
      }
    });
    Matter.Events.on(mouseConstraint, "enddrag", () => {
      isDragging = false;
      container.style.cursor = "default";
    });

    let animationId: number;
    const updateLoop = () => {
      bodiesRef.current.forEach((body, id) => {
        const el = tagRefs.current.get(id);
        if (el) {
          el.style.transform = `translate3d(${body.position.x}px, ${body.position.y}px, 0) translate3d(-50%, -50%, 0) rotate(${body.angle}rad)`;
        }
      });
      if (!isDragging) {
        const bodiesAtPoint = Matter.Query.point(
          Matter.Composite.allBodies(engine.world),
          mouse.position,
        );
        const isOverTag = bodiesAtPoint.some((b) =>
          b.label?.startsWith("tag-"),
        );
        container.style.cursor = isOverTag ? "grab" : "default";
      }

      animationId = requestAnimationFrame(updateLoop);
    };

    const runner = Matter.Runner.create();
    const timer = setTimeout(() => {
      Matter.Runner.run(runner, engine);
      updateLoop();
    }, 1500);

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      Matter.Composite.remove(engine.world, walls);
      walls = [
        Matter.Bodies.rectangle(
          newWidth / 2,
          newHeight + wallThickness / 2,
          newWidth + 200,
          wallThickness,
          { isStatic: true, friction: 0.8, restitution: 0.3 },
        ),
        Matter.Bodies.rectangle(
          -wallThickness / 2,
          newHeight / 2,
          wallThickness,
          newHeight * 2,
          { isStatic: true, friction: 0.5 },
        ),
        Matter.Bodies.rectangle(
          newWidth + wallThickness / 2,
          newHeight / 2,
          wallThickness,
          newHeight * 2,
          { isStatic: true, friction: 0.5 },
        ),
      ];
      Matter.Composite.add(engine.world, walls);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, []);

  return (
    <div ref={sceneRef} className="absolute inset-0 z-20">
      {skillTags.map((tag) => {
        const config = sizeConfig[tag.size as keyof typeof sizeConfig];
        const isFilled = tag.variant === "filled";
        return (
          <div
            key={tag.id}
            ref={(el) => {
              if (el) tagRefs.current.set(tag.id, el);
              else tagRefs.current.delete(tag.id);
            }}
            className={`absolute font-medium tracking-wide rounded-full select-none pointer-events-none transition-colors duration-300 border-2 ${
              isFilled
                ? "bg-[#3250FE] text-white border-[#3250FE]"
                : "bg-transparent text-[#3250FE] border-[#3250FE]"
            }`}
            style={{
              width: config.width,
              height: config.height,
              fontSize: config.fontSize,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              willChange: "transform",
              boxShadow: isFilled
                ? isDark
                  ? "0 4px 20px rgba(50, 80, 254, 0.4)"
                  : "0 4px 20px rgba(50, 80, 254, 0.25)"
                : "none",
              transform:
                "translate3d(0, -1000px, 0) translate3d(-50%, -50%, 0)",
            }}
          >
            {language === "zh" ? tag.zh : tag.text}
          </div>
        );
      })}
    </div>
  );
}
