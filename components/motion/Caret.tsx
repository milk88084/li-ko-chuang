// A blinking text cursor, as if the line before it is still being typed.
// Colour comes from the parent via `className` (bg-*); it stays solid for
// anyone who asks for reduced motion. Decorative.
export function Caret({ className = "bg-accent" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`ml-[0.08em] inline-block h-[0.9em] w-[0.06em] min-w-[2px] translate-y-[0.12em] motion-safe:animate-[caret-blink_1.06s_steps(1)_infinite] ${className}`}
    />
  );
}
