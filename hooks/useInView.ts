import { useEffect, useState, type RefObject } from "react";

/**
 * True once `ref` has scrolled into view, and stays true — for things that
 * should start once (a line drawing, the physics drop) rather than replay.
 */
export function useInView(
  ref: RefObject<Element | null>,
  { rootMargin = "0px 0px -15% 0px" }: { rootMargin?: string } = {},
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, inView]);

  return inView;
}
