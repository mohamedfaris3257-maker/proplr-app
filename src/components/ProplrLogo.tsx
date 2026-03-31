/** Proplr logo — uses the actual brand icon images.
 *  - icon-blue.png: navy/gold icon on transparent (for light backgrounds)
 *  - icon-white.png: white/gold icon on transparent (for dark backgrounds)
 *  - logo.png: full logo with text (for dark backgrounds)
 */

/* Icon-only: picks the right variant based on background */
export function ProplrIcon({
  size = 24,
  variant = 'dark',
}: {
  size?: number;
  color?: string;
  variant?: 'dark' | 'light';
}) {
  const src = variant === 'light' ? '/icon-white.png' : '/icon-blue.png';
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Proplr"
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'block',
        flexShrink: 0,
      }}
    />
  );
}

/* Full logo: icon + PROPLR text from the original logo.png (white text, dark bg only) */
export function ProplrLogo({ height = 36 }: { height?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Proplr"
      style={{
        height,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  );
}
