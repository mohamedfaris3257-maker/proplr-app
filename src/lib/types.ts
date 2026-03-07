// ─── Enums ────────────────────────────────────────────────────────────────────
export type UserType = 'school_student' | 'uni_student' | 'admin';
export type SubscriptionStatus = 'free' | 'premium';
export type PillarHourStatus = 'pending' | 'approved' | 'rejected';
export type ApplicationStatus = 'applied' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
export type OpportunityType = 'internship' | 'job' | 'challenge' | 'job_shadowing' | 'volunteering' | 'micro_placement';
export type AudienceType = 'school' | 'uni' | 'both';
export type ItemType = 'post' | 'event' | 'opportunity';
export type NotificationType = 'event' | 'rsvp' | 'waitlist' | 'application' | 'certificate' | 'badge' | 'hours' | 'comment' | 'general';
export type BadgeType = 'first_post' | 'explorer' | 'on_fire' | 'networker' | 'pioneer' | 'achiever' | 'all_star';

// ─── Constants ────────────────────────────────────────────────────────────────
export const PILLARS = [
  'Leadership',
  'Entrepreneurship',
  'Digital Literacy',
  'Personal Branding',
  'Communication',
  'Project Management',
] as const;

export type PillarName = typeof PILLARS[number];

export const CAREER_INTERESTS = [
  'Technology',
  'Business',
  'Design',
  'Healthcare',
  'Law',
  'Engineering',
  'Media',
  'Finance',
  'Education',
  'Science',
] as const;

export type CareerInterest = typeof CAREER_INTERESTS[number];

export const PILLAR_COLORS: Record<PillarName, string> = {
  'Leadership': '#E8A838',
  'Entrepreneurship': '#4A90D9',
  'Digital Literacy': '#1ABC9C',
  'Personal Branding': '#9B59B6',
  'Communication': '#27AE60',
  'Project Management': '#E05C3A',
};

export const PILLAR_TAGS_BG: Record<PillarName, string> = {
  'Leadership': 'bg-gold/10 text-gold',
  'Entrepreneurship': 'bg-blue/10 text-blue',
  'Digital Literacy': 'bg-teal/10 text-teal',
  'Personal Branding': 'bg-purple/10 text-purple',
  'Communication': 'bg-green/10 text-green',
  'Project Management': 'bg-red/10 text-red',
};

export const BADGE_META: Record<BadgeType, { label: string; icon: string; description: string }> = {
  first_post:  { label: 'First Post',  icon: '✍️',  description: 'Published your first post' },
  explorer:    { label: 'Explorer',    icon: '🧭',  description: 'Posted in all 6 pillars' },
  on_fire:     { label: 'On Fire',     icon: '🔥',  description: '4-week streak in any pillar' },
  networker:   { label: 'Networker',   icon: '🤝',  description: 'RSVP\'d to 5+ events' },
  pioneer:     { label: 'Pioneer',     icon: '🚀',  description: 'First from your school to complete a pillar' },
  achiever:    { label: 'Achiever',    icon: '🏆',  description: 'Earned your first certificate' },
  all_star:    { label: 'All-Star',    icon: '⭐',  description: 'Earned all 6 pillar certificates' },
};

// ─── Database Interfaces ──────────────────────────────────────────────────────
export interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  type: UserType;
  school_name: string | null;
  grade: string | null;
  photo_url: string | null;
  career_interests: CareerInterest[];
  subscription_status: SubscriptionStatus;
  subscription_end_date: string | null;
  is_ambassador: boolean;
  username: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  pillar_tag: PillarName | null;
  likes_count: number;
  is_pinned: boolean;
  comment_count: number;
  created_at: string;
  profiles?: Profile;
}

/*
 * SQL: comments table
 * CREATE TABLE comments (
 *   id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   post_id     uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
 *   user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *   content     text NOT NULL,
 *   created_at  timestamptz NOT NULL DEFAULT now()
 * );
 * -- Enable RLS and add policies:
 * ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Anyone can read comments"  ON comments FOR SELECT USING (true);
 * CREATE POLICY "Auth users can insert"     ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
 * CREATE POLICY "Owner can delete"          ON comments FOR DELETE USING (auth.uid() = user_id);
 */
export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: Profile;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string | null;
  online_link: string | null;
  pillar_tag: PillarName | null;
  event_type: string;
  audience: AudienceType;
  capacity: number | null;
  spots_remaining: number | null;
  is_paid: boolean;
  price: number | null;
  is_featured: boolean;
  created_at: string;
}

export interface RSVP {
  id: string;
  user_id: string;
  event_id: string;
  waitlisted: boolean;
  waitlist_position: number | null;
  created_at: string;
  events?: Event;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  description: string;
  type: OpportunityType;
  pillar_tags: PillarName[];
  audience: AudienceType;
  deadline: string | null;
  is_active: boolean;
  created_at: string;
}

export interface SavedItem {
  id: string;
  user_id: string;
  item_id: string;
  item_type: ItemType;
  created_at: string;
}

export interface PillarHour {
  id: string;
  user_id: string;
  pillar_name: PillarName;
  hours: number;
  source: string;
  status: PillarHourStatus;
  rejection_note: string | null;
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  pillar_name: PillarName;
  issued_at: string;
  pdf_url: string | null;
  khda_attested: boolean;
}

export interface Application {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: ApplicationStatus;
  cover_text: string | null;
  portfolio_item_id: string | null;
  created_at: string;
  opportunities?: Opportunity;
  profiles?: Profile;
}

export interface PortfolioItem {
  id: string;
  user_id: string;
  title: string;
  description: string;
  media_url: string | null;
  pillar_tag: PillarName | null;
  is_pinned: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  pillar_name: PillarName;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
}

export interface Badge {
  id: string;
  user_id: string;
  badge_type: BadgeType;
  earned_at: string;
}
