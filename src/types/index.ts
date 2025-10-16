// User Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  company_id?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
  preferences: UserPreferences;
}

export type UserRole = 'admin' | 'curator' | 'trainer' | 'operator' | 'customer-admin';

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  playback_defaults: {
    autoplay: boolean;
    captions: boolean;
    speed: number;
  };
  notifications: {
    email: boolean;
    in_app: boolean;
  };
}

// Reel Types
export interface Reel {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  transcript: TranscriptSegment[];
  tags: string[];
  machine_model?: string;
  process_step?: string;
  tooling?: string[];
  author_id: string;
  author: User;
  status: ReelStatus;
  created_at: string;
  updated_at: string;
  view_count: number;
  customer_allocations: string[];
  metadata: ReelMetadata;
}

export type ReelStatus = 'draft' | 'pending_qa' | 'approved' | 'published' | 'archived';

export interface TranscriptSegment {
  id: string;
  start_time: number;
  end_time: number;
  text: string;
  speaker?: string;
}

export interface ReelMetadata {
  resolution: string;
  codec: string;
  file_size: number;
  upload_source: string;
  quality_score?: number;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  modules: CourseModule[];
  quiz?: Quiz;
  completion_rules: CompletionRules;
  target_audience: string[];
  customer_allocations: string[];
  author_id: string;
  author: User;
  status: CourseStatus;
  created_at: string;
  updated_at: string;
  enrolled_count: number;
  completion_count: number;
}

export type CourseStatus = 'draft' | 'published' | 'archived';

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  reels: CourseReel[];
  order: number;
  prerequisites?: string[];
}

export interface CourseReel {
  id: string;
  reel_id: string;
  reel: Reel;
  order: number;
  required: boolean;
  min_watch_percentage?: number;
}

export interface CompletionRules {
  require_all_reels: boolean;
  min_watch_percentage: number;
  require_quiz_pass: boolean;
  quiz_passing_score: number;
  time_limit_days?: number;
}

// Quiz Types
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passing_score: number;
  time_limit_minutes?: number;
  attempts_allowed?: number;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correct_answer: string | string[];
  explanation?: string;
  reel_timestamp?: number;
  points: number;
  order: number;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

// Certificate Types
export interface Certificate {
  id: string;
  user_id: string;
  user: User;
  course_id: string;
  course: Course;
  issued_at: string;
  expires_at?: string;
  verification_url: string;
  pdf_url: string;
  status: CertificateStatus;
}

export type CertificateStatus = 'active' | 'expired' | 'revoked';

// Progress Types
export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  reel_id?: string;
  progress_type: ProgressType;
  completed_at?: string;
  score?: number;
  time_spent: number;
  created_at: string;
}

export type ProgressType = 'reel_viewed' | 'quiz_attempted' | 'course_completed';

// Search Types
export interface SearchFilters {
  query?: string;
  tags?: string[];
  machine_models?: string[];
  process_steps?: string[];
  duration_min?: number;
  duration_max?: number;
  created_by?: string[];
  date_from?: string;
  date_to?: string;
  status?: ReelStatus[];
}

export interface SearchResult {
  reels: Reel[];
  total: number;
  page: number;
  limit: number;
  facets: SearchFacets;
}

export interface SearchFacets {
  tags: FacetItem[];
  machine_models: FacetItem[];
  process_steps: FacetItem[];
  authors: FacetItem[];
}

export interface FacetItem {
  value: string;
  count: number;
}

// API Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}

// Form Types
export interface SignInForm {
  email: string;
  password: string;
  remember_me: boolean;
}

export interface SignUpForm {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  company: string;
  role: UserRole;
  terms_accepted: boolean;
}

export interface CreateReelForm {
  title: string;
  description: string;
  tags: string[];
  machine_model?: string;
  process_step?: string;
  tooling: string[];
  customer_allocations: string[];
}

export interface CreateCourseForm {
  title: string;
  description: string;
  modules: Omit<CourseModule, 'id'>[];
  completion_rules: CompletionRules;
  target_audience: string[];
  customer_allocations: string[];
}

// Dashboard Types
export interface DashboardStats {
  total_reels: number;
  total_courses: number;
  total_users: number;
  total_views: number;
  courses_assigned: number;
  reels_watched_today: number;
  certificates_earned: number;
  completion_rate: number;
}

export interface ActivityItem {
  id: string;
  type: 'reel_viewed' | 'course_completed' | 'certificate_earned' | 'reel_uploaded';
  user_id: string;
  user: User;
  title: string;
  description: string;
  created_at: string;
  metadata?: Record<string, any>;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
  metadata?: Record<string, any>;
}

export type NotificationType = 
  | 'course_assigned'
  | 'course_completed'
  | 'certificate_earned'
  | 'reel_approved'
  | 'reel_rejected'
  | 'system_update'
  | 'billing_alert';

// Company/Organization Types
export interface Company {
  id: string;
  name: string;
  domain: string;
  logo_url?: string;
  subscription_plan: SubscriptionPlan;
  seat_count: number;
  seats_used: number;
  created_at: string;
  updated_at: string;
  settings: CompanySettings;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    reels: number;
    courses: number;
    users: number;
    storage_gb: number;
  };
}

export interface CompanySettings {
  sso_enabled: boolean;
  sso_provider?: string;
  password_policy: PasswordPolicy;
  content_allocation_rules: ContentAllocationRule[];
  branding: BrandingSettings;
}

export interface PasswordPolicy {
  min_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_symbols: boolean;
  max_age_days?: number;
}

export interface ContentAllocationRule {
  id: string;
  machine_model?: string;
  process_step?: string;
  tags?: string[];
  customer_groups: string[];
}

export interface BrandingSettings {
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  custom_css?: string;
}
