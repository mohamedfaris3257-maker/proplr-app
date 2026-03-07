import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center gap-6 font-sans">
      <div className="space-y-2">
        <p className="text-5xl font-bold text-gold">404</p>
        <h1 className="text-xl font-semibold text-text-primary">Profile not found</h1>
        <p className="text-sm text-text-muted max-w-xs">
          This profile does not exist or is not publicly visible.
        </p>
      </div>
      <Link
        href="https://proplr.ae"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:underline"
      >
        ✦ Back to Proplr
      </Link>
    </div>
  );
}
