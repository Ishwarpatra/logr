/** The logr brand mark — two stacked asymmetric dots (the colon, rotated):
 *  a larger accent "present" dot over a smaller ink "past" dot. Sizes by
 *  the parent's font-size. Used to the left of the wordmark. */
export function Mark({ className }: { className?: string }) {
  return (
    <span className={`mark${className ? ` ${className}` : ""}`} aria-hidden="true">
      <span className="d-top" />
      <span className="d-bot" />
    </span>
  );
}
