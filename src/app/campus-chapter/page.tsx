import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Launch a Campus Chapter | Proplr Impact',
  description: 'Bring Proplr Impact to your university. Run the program as a campus club, earn leadership experience, and connect your peers to industry.',
};

export default function CampusChapterPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f0f2f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 600, textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#3d9be9', marginBottom: 16 }}>PROPLR IMPACT</div>
        <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 40, fontWeight: 900, color: '#071629', marginBottom: 16 }}>
          Launch a Campus Chapter
        </h1>
        <p style={{ fontSize: 16, color: '#6e7591', lineHeight: 1.7, marginBottom: 32 }}>
          Bring Proplr Impact to your university. Run the program as a campus club, earn leadership experience, and connect your peers to industry.
        </p>
        <a href="/register" style={{ background: '#3d9be9', color: '#fff', borderRadius: 100, padding: '14px 32px', fontSize: 15, fontWeight: 700, textDecoration: 'none', fontFamily: 'inherit', display: 'inline-block' }}>
          Apply to Lead a Chapter
        </a>
      </div>
    </main>
  );
}
