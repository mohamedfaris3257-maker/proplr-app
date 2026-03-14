import Link from 'next/link';

export const metadata = { title: 'Programs – Proplr' };

export default function ProgramsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text-primary mb-3">Our Programs</h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          Two structured tracks designed to support every UAE student from school through university.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="card p-8">
          <span className="text-4xl mb-4 block">🏫</span>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Foundation Track</h2>
          <p className="text-sm text-gold font-medium mb-4">School Students · Grades 6–12</p>
          <p className="text-text-secondary leading-relaxed mb-6">
            Build career awareness, log community hours, earn KHDA-attested certificates, and prepare
            for university applications through the six pillar framework.
          </p>
          <Link href="/foundation" className="text-sm font-semibold text-gold hover:text-gold/80 transition-colors">
            Learn More →
          </Link>
        </div>
        <div className="card p-8">
          <span className="text-4xl mb-4 block">🎓</span>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Impact Track</h2>
          <p className="text-sm text-blue font-medium mb-4">University Students</p>
          <p className="text-text-secondary leading-relaxed mb-6">
            Access real internships, mentorship from industry leaders, and build a verified portfolio
            that stands out to top employers across the UAE and globally.
          </p>
          <Link href="/impact" className="text-sm font-semibold text-blue hover:text-blue/80 transition-colors">
            Learn More →
          </Link>
        </div>
      </div>
      <div className="text-center">
        <Link href="/register" className="px-10 py-4 bg-blue hover:bg-blue/90 text-white text-lg font-bold rounded-xl transition-colors shadow-lg shadow-blue/20">
          Apply Now — It&apos;s Free
        </Link>
      </div>
    </div>
  );
}
