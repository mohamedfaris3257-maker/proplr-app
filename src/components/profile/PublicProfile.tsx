import Link from 'next/link';
import { Award } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge, PillarBadge } from '@/components/ui/Badge';
import { PillarRing } from '@/components/profile/PillarRing';
import { PILLARS, PILLAR_COLORS } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import type { Profile, Certificate, PortfolioItem, PillarName } from '@/lib/types';

interface PublicProfileProps {
  profile: Profile;
  pinnedItems: PortfolioItem[];
  certificates: Certificate[];
  pillarHoursMap: Record<PillarName, number>;
}

function isVideoUrl(url: string) {
  return url.includes('youtube') || url.includes('vimeo');
}

export function PublicProfile({
  profile,
  pinnedItems,
  certificates,
  pillarHoursMap,
}: PublicProfileProps) {
  const totalHours = Object.values(pillarHoursMap).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Simple header */}
      <header className="sticky top-0 z-10 bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="https://proplr.ae"
            className="text-base font-bold text-gold tracking-tight hover:opacity-80 transition-opacity"
          >
            ✦ Proplr
          </Link>
          <Link
            href="/login"
            className="text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Profile card */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar name={profile.name} photoUrl={profile.photo_url} size="xl" />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-text-primary">{profile.name}</h1>
              {profile.school_name && (
                <p className="text-sm text-text-muted mt-0.5">{profile.school_name}</p>
              )}

              {/* Career interests */}
              {(profile.career_interests || []).length > 0 && (
                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  {profile.career_interests.map((interest) => (
                    <Badge key={interest} variant="default">
                      {interest}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 sm:flex-col sm:gap-2 sm:items-end flex-shrink-0">
              <div className="text-center">
                <p className="text-xl font-bold text-gold">{totalHours}</p>
                <p className="text-[11px] text-text-muted">Total Hours</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-blue">{certificates.length}</p>
                <p className="text-[11px] text-text-muted">Certificates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar progress rings */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Pillar Progress</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 justify-items-center">
            {PILLARS.map((pillar) => (
              <PillarRing
                key={pillar}
                pillar={pillar as PillarName}
                hours={pillarHoursMap[pillar as PillarName] || 0}
                size={72}
              />
            ))}
          </div>
        </div>

        {/* Pinned portfolio items */}
        {pinnedItems.length > 0 && (
          <div className="card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-text-primary">Featured Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pinnedItems.map((item) => (
                <div key={item.id} className="bg-surface-2 rounded-lg border border-border p-4 space-y-2">
                  {/* Media preview */}
                  {item.media_url && isVideoUrl(item.media_url) && (
                    <a
                      href={item.media_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-blue hover:underline truncate"
                    >
                      {item.media_url.includes('youtube') ? 'Watch on YouTube' : 'Watch on Vimeo'} →
                    </a>
                  )}
                  {item.media_url && !isVideoUrl(item.media_url) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.media_url}
                      alt={item.title}
                      className="w-full h-28 object-cover rounded-lg"
                    />
                  )}
                  <p className="font-semibold text-sm text-text-primary leading-snug">
                    {item.title}
                  </p>
                  {item.pillar_tag && <PillarBadge pillar={item.pillar_tag} />}
                  <p className="text-xs text-text-secondary line-clamp-3">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <div className="card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-text-primary">Certificates Earned</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {certificates.map((cert) => {
                const color = PILLAR_COLORS[cert.pillar_name] ?? '#E8A838';
                return (
                  <div
                    key={cert.id}
                    className="flex items-center gap-3 p-3 bg-surface-2 rounded-lg border border-border"
                    style={{ borderColor: `${color}25` }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Award className="w-4 h-4" style={{ color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold" style={{ color }}>
                        {cert.pillar_name}
                      </p>
                      <p className="text-xs text-text-muted">{formatDate(cert.issued_at)}</p>
                    </div>
                    {cert.khda_attested && (
                      <span className="text-[10px] font-bold bg-green/10 text-green border border-green/20 px-1.5 py-0.5 rounded-sm flex-shrink-0">
                        KHDA
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-text-muted">
            Powered by{' '}
            <a
              href="https://proplr.ae"
              className="text-gold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Proplr
            </a>{' '}
            | proplr.ae
          </p>
        </div>
      </footer>
    </div>
  );
}
