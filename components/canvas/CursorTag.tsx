// A collaborator's cursor, as a multiplayer design tool shows it: an arrow
// with a name tag hanging off it. Decorative; the float animation stops for
// anyone who asks for reduced motion.
export function CursorTag({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none flex flex-col items-start motion-safe:animate-[cursor-float_6s_ease-in-out_infinite] ${className}`}
    >
      <svg width="16" height="18" viewBox="0 0 16 18" className="text-accent">
        <path
          d="M1 1 L15 8.5 L8.5 10 L5.5 16.5 Z"
          fill="currentColor"
          stroke="var(--bg)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <span className="mt-0.5 ml-3 rounded-[3px] bg-accent px-1.5 py-0.5 font-mono text-[11px] text-accent-ink">
        {name}
      </span>
    </div>
  );
}
