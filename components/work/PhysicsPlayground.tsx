"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import type { Locale } from "@/lib/locale";
import { SKILL_TAGS, TAG_SIZES } from "./skill-tags";

// The skill tags as a physics toy, confined to the box it is mounted in
// (it used to fill the whole homepage viewport). Tags drop in from above,
// can be dragged with a mouse, and a click or tap on empty space kicks the
// nearby ones upward.
//
// Matter's Mouse swallows wheel and touch events to stop the page scrolling
// while you play — fine for a full-screen toy, wrong for a box in the middle
// of a page — so those listeners are removed: the page always scrolls, and
// on touch the tags are tapped rather than dragged.

const WALL = 80;

export default function PhysicsPlayground({ locale }: { locale: Locale }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    const container = sceneRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1 },
      enableSleeping: true,
    });

    const makeWalls = () => [
      Matter.Bodies.rectangle(width / 2, height + WALL / 2, width + WALL * 2, WALL, {
        isStatic: true,
        friction: 0.8,
        restitution: 0.3,
      }),
      Matter.Bodies.rectangle(-WALL / 2, height / 2, WALL, height * 4, {
        isStatic: true,
        friction: 0.5,
      }),
      Matter.Bodies.rectangle(width + WALL / 2, height / 2, WALL, height * 4, {
        isStatic: true,
        friction: 0.5,
      }),
    ];
    let walls = makeWalls();
    Matter.Composite.add(engine.world, walls);

    // Narrow boxes (phones) get smaller tags so they still fit side by side.
    const scale = width < 520 ? 0.82 : 1;

    const bodies = new Map<number, Matter.Body>();
    SKILL_TAGS.forEach((tag, index) => {
      const size = TAG_SIZES[tag.size];
      const w = size.width * scale;
      const h = size.height * scale;
      const x = w / 2 + Math.random() * Math.max(1, width - w);
      const y = -60 - index * 55 - Math.random() * 60;
      const body = Matter.Bodies.rectangle(x, y, w, h, {
        chamfer: { radius: h / 2 },
        friction: 0.3,
        frictionAir: 0.01,
        restitution: 0.55,
        density: 0.001,
        label: `tag-${tag.id}`,
      });
      Matter.Body.setAngle(body, (Math.random() - 0.5) * 0.6);
      bodies.set(tag.id, body);
      Matter.Composite.add(engine.world, body);

      const el = tagRefs.current.get(tag.id);
      if (el) {
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.fontSize = `${size.fontSize * scale}px`;
      }
    });

    const mouse = Matter.Mouse.create(container);
    // See the note at the top: keep the page scrollable.
    const m = mouse as Matter.Mouse & Record<string, EventListener>;
    container.removeEventListener("wheel", m.mousewheel);
    container.removeEventListener("touchstart", m.mousedown);
    container.removeEventListener("touchmove", m.mousemove);
    container.removeEventListener("touchend", m.mouseup);

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Matter.Composite.add(engine.world, mouseConstraint);

    let dragging = false;
    Matter.Events.on(mouseConstraint, "startdrag", () => {
      dragging = true;
    });
    Matter.Events.on(mouseConstraint, "enddrag", () => {
      dragging = false;
    });

    // Click / tap on empty space: push every tag near the point up and away.
    const onPointerDown = (event: PointerEvent) => {
      const box = container.getBoundingClientRect();
      const point = { x: event.clientX - box.left, y: event.clientY - box.top };
      const hit = Matter.Query.point(Array.from(bodies.values()), point);
      if (hit.length && event.pointerType === "mouse") return; // a drag
      bodies.forEach((body) => {
        const dx = body.position.x - point.x;
        const dy = body.position.y - point.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 260) return;
        Matter.Sleeping.set(body, false);
        const strength = (1 - distance / 260) * 0.06 * body.mass;
        Matter.Body.applyForce(body, body.position, {
          x: (dx / (distance || 1)) * strength * 0.5,
          y: -strength,
        });
      });
    };
    container.addEventListener("pointerdown", onPointerDown);

    let frame = 0;
    const loop = () => {
      bodies.forEach((body, id) => {
        const el = tagRefs.current.get(id);
        if (el) {
          el.style.transform = `translate3d(${body.position.x}px, ${body.position.y}px, 0) translate3d(-50%, -50%, 0) rotate(${body.angle}rad)`;
        }
      });
      // The tags themselves ignore the pointer (Matter hit-tests for them),
      // so the custom cursor learns it is over one from this attribute.
      const over =
        dragging ||
        Matter.Query.point(Array.from(bodies.values()), mouse.position).length > 0;
      if (over) container.dataset.cursor = "drag";
      else delete container.dataset.cursor;
      frame = requestAnimationFrame(loop);
    };

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    frame = requestAnimationFrame(loop);

    const observer = new ResizeObserver(() => {
      width = container.clientWidth;
      height = container.clientHeight;
      Matter.Composite.remove(engine.world, walls);
      walls = makeWalls();
      Matter.Composite.add(engine.world, walls);
      // A sleeping body ignores the floor moving out from under it.
      bodies.forEach((body) => Matter.Sleeping.set(body, false));
    });
    observer.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      container.removeEventListener("pointerdown", onPointerDown);
      Matter.Runner.stop(runner);
      Matter.Mouse.clearSourceEvents(mouse);
      Matter.Engine.clear(engine);
    };
  }, []);

  return (
    <div ref={sceneRef} className="absolute inset-0 touch-pan-y overflow-hidden">
      {SKILL_TAGS.map((tag) => (
        <div
          key={tag.id}
          ref={(el) => {
            if (el) tagRefs.current.set(tag.id, el);
            else tagRefs.current.delete(tag.id);
          }}
          className={`pointer-events-none absolute top-0 left-0 flex items-center justify-center rounded-full border-[1.5px] border-accent tracking-wide whitespace-nowrap select-none ${
            tag.variant === "filled"
              ? "bg-accent text-accent-ink"
              : "bg-bg text-accent"
          }`}
          style={{
            willChange: "transform",
            transform: "translate3d(0, -1000px, 0)",
          }}
        >
          {tag[locale]}
        </div>
      ))}
    </div>
  );
}
