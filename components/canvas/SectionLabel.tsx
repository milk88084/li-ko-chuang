// "/ Hello" — the mono kicker that opens every section.
export function SectionLabel({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return <p className={`section-label ${className}`}>{`/ ${children}`}</p>;
}
