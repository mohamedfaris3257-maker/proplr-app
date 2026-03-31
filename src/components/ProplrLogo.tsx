/** Proplr logo — uses the actual brand image (/logo.png).
 *  ProplrIcon: shows just the propeller icon (cropped from the full logo).
 *  ProplrLogo: shows the full logo image (propeller + text). Best on dark backgrounds. */

/* Icon-only version: crops to the propeller portion of the logo image */
export function ProplrIcon({ size = 24 }: { size?: number; color?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Proplr"
        style={{
          height: size,
          width: 'auto',
          objectFit: 'cover',
          objectPosition: 'left center',
          display: 'block',
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      />
    </div>
  );
}

/* Full logo version: shows the complete logo image (propeller + PROPLR text).
 * Best used on dark backgrounds where the white text is visible. */
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
