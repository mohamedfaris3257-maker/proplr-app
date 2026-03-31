/** Proplr propeller logo — matches the official brand mark.
 *  Gold blades, navy center with white ring.
 *  Use `size` for the icon-only version, or wrap with text for full logo. */
export function ProplrIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Gold blades */}
      <ellipse cx="50" cy="22" rx="10" ry="24" fill="#F5C44E" />
      <ellipse cx="50" cy="78" rx="10" ry="24" fill="#F5C44E" />
      <ellipse cx="22" cy="50" rx="24" ry="10" fill="#F5C44E" />
      <ellipse cx="78" cy="50" rx="24" ry="10" fill="#F5C44E" />
      {/* Navy center */}
      <circle cx="50" cy="50" r="16" fill="#1B3A5C" />
      {/* White ring */}
      <circle cx="50" cy="50" r="10" fill="none" stroke="#ffffff" strokeWidth="3" />
      {/* Navy inner dot */}
      <circle cx="50" cy="50" r="6" fill="#1B3A5C" />
    </svg>
  );
}
