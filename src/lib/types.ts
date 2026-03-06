export type UserType = 'school_student' | 'uni_student' | 'admin';
export type SubscriptionStatus = 'free' | 'premium';
export type PillarHourStatus = 'pending' | 'approved';
export type ApplicationStatus = 'applied' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
export type OpportunityType = 'internship' | 'job' | 'challenge' | 'job_shadowing' | 'volunteering' | 'micro_placement';
export type AudienceType = 'school' | 'uni' | 'both';
export type ItemType = 'post' | 'event' | 'opportunity';

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
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  pillar_tag: PillarName | null;
  likes_count: number;
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
  created_at: string;
}

export interface RSVP {
  id: string;
  user_id: string;
  event_id: string;
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
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  pillar_name: PillarName;
  issued_at: string;
  khda_attested: boolean;
}

export interface Application {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: ApplicationStatus;
  created_at: string;
  opportunities?: Opportunity;
}
