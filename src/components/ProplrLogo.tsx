/** Proplr propeller logo — matches the official brand mark.
 *  Gold blades with rounded tips, subtle center ring.
 *  Use `size` for the icon-only version, or wrap with text for full logo. */
export function ProplrIcon({ size = 24, color = '#F5C44E' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Faint compass ring behind */}
      <circle cx="50" cy="50" r="34" stroke={color} strokeWidth="2" strokeOpacity="0.15" />
      <circle cx="50" cy="50" r="42" stroke={color} strokeWidth="1.5" strokeOpacity="0.08" />
      {/* Four curved blades */}
      <ellipse cx="50" cy="20" rx="9" ry="22" fill={color} />
      <ellipse cx="50" cy="80" rx="9" ry="22" fill={color} />
      <ellipse cx="20" cy="50" rx="22" ry="9" fill={color} />
      <ellipse cx="80" cy="50" rx="22" ry="9" fill={color} />
      {/* Center ring */}
      <circle cx="50" cy="50" r="11" stroke={color} strokeWidth="3" fill="none" strokeOpacity="0.3" />
      <circle cx="50" cy="50" r="5" fill={color} fillOpacity="0.25" />
    </svg>
  );
}
