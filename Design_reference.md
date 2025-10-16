# Modern Design Best Practices

## Philosophy

Create unique, memorable experiences while maintaining consistency through modern design principles. Every project should feel distinct yet professional, innovative yet intuitive.

---

## Landing Pages & Marketing Sites

### Hero Sections
**Go beyond static backgrounds:**
- Animated gradients with subtle movement
- Particle systems or geometric shapes floating
- Interactive canvas backgrounds (Three.js, WebGL)
- Video backgrounds with proper fallbacks
- Parallax scrolling effects
- Gradient mesh animations
- Morphing blob animations

**Avoid:** Plain solid colors or static images

### Layout Patterns
**Use modern grid systems:**
- Bento grids (asymmetric card layouts)
- Masonry layouts for varied content
- Feature sections with diagonal cuts or curves
- Overlapping elements with proper z-index
- Split-screen designs with scroll-triggered reveals

**Avoid:** Traditional 3-column equal grids

### Scroll Animations
**Engage users as they scroll:**
- Fade-in and slide-up animations for sections
- Scroll-triggered parallax effects
- Progress indicators for long pages
- Sticky elements that transform on scroll
- Horizontal scroll sections for portfolios
- Text reveal animations (word by word, letter by letter)
- Number counters animating into view

**Avoid:** Static pages with no scroll interaction

### Call-to-Action Areas
**Make CTAs impossible to miss:**
- Gradient buttons with hover effects
- Floating action buttons with micro-interactions
- Animated borders or glowing effects
- Scale/lift on hover
- Interactive elements that respond to mouse position
- Pulsing indicators for primary actions

---

## Dashboard Applications

### Layout Structure
**Always use collapsible side navigation:**
- Sidebar that can collapse to icons only
- Smooth transition animations between states
- Persistent navigation state (remember user preference)
- Mobile: drawer that slides in/out
- Desktop: sidebar with expand/collapse toggle
- Icons visible even when collapsed

**Structure:**
```
/dashboard (layout wrapper with sidebar)
  /dashboard/overview
  /dashboard/analytics
  /dashboard/settings
  /dashboard/users
  /dashboard/projects
```

All dashboard pages should be nested inside the dashboard layout, not separate routes.

### Data Tables
**Modern table design:**
- Sticky headers on scroll
- Row hover states with subtle elevation
- Sortable columns with clear indicators
- Pagination with items-per-page control
- Search/filter with instant feedback
- Selection checkboxes with bulk actions
- Responsive: cards on mobile, table on desktop
- Loading skeletons, not spinners
- Empty states with illustrations or helpful text

**Use modern table libraries:**
- TanStack Table (React Table v8)
- AG Grid for complex data
- Data Grid from MUI (if using MUI)

### Charts & Visualizations
**Use the latest charting libraries:**
- Recharts (for React, simple charts)
- Chart.js v4 (versatile, well-maintained)
- Apache ECharts (advanced, interactive)
- D3.js (custom, complex visualizations)
- Tremor (for dashboards, built on Recharts)

**Chart best practices:**
- Animated transitions when data changes
- Interactive tooltips with detailed info
- Responsive sizing
- Color scheme matching design system
- Legend placement that doesn't obstruct data
- Loading states while fetching data

### Dashboard Cards
**Metric cards should stand out:**
- Gradient backgrounds or colored accents
- Trend indicators (↑ ↓ with color coding)
- Sparkline charts for historical data
- Hover effects revealing more detail
- Icon representing the metric
- Comparison to previous period

---

## Color & Visual Design

### Color Palettes
**Create depth with gradients:**
- Primary gradient (not just solid primary color)
- Subtle background gradients
- Gradient text for headings
- Gradient borders on cards
- Dark mode with elevated surfaces

**Color usage:**
- 60-30-10 rule (dominant, secondary, accent)
- Consistent semantic colors (success, warning, error)
- Accessible contrast ratios (WCAG AA minimum)

### Typography
**Create hierarchy through contrast:**
- Large, bold headings (48-72px for heroes)
- Clear size differences between levels
- Variable font weights (300, 400, 600, 700)
- Letter spacing for small caps
- Line height 1.5-1.7 for body text
- Inter, Poppins, or DM Sans for modern feel

### Shadows & Depth
**Layer UI elements:**
- Multi-layer shadows for realistic depth
- Colored shadows matching element color
- Elevated states on hover
- Neumorphism for special elements (sparingly)

---

## Interactions & Micro-animations

### Button Interactions
**Every button should react:**
- Scale slightly on hover (1.02-1.05)
- Lift with shadow on hover
- Ripple effect on click
- Loading state with spinner or progress
- Disabled state clearly visible
- Success state with checkmark animation

### Card Interactions
**Make cards feel alive:**
- Lift on hover with increased shadow
- Subtle border glow on hover
- Tilt effect following mouse (3D transform)
- Smooth transitions (200-300ms)
- Click feedback for interactive cards

### Form Interactions
**Guide users through forms:**
- Input focus states with border color change
- Floating labels that animate up
- Real-time validation with inline messages
- Success checkmarks for valid inputs
- Error states with shake animation
- Password strength indicators
- Character count for text areas

### Page Transitions
**Smooth between views:**
- Fade + slide for page changes
- Skeleton loaders during data fetch
- Optimistic UI updates
- Stagger animations for lists
- Route transition animations

---

## Mobile Responsiveness

### Mobile-First Approach
**Design for mobile, enhance for desktop:**
- Touch targets minimum 44x44px
- Generous padding and spacing
- Sticky bottom navigation on mobile
- Collapsible sections for long content
- Swipeable cards and galleries
- Pull-to-refresh where appropriate

### Responsive Patterns
**Adapt layouts intelligently:**
- Hamburger menu → full nav bar
- Card grid → stack on mobile
- Sidebar → drawer
- Multi-column → single column
- Data tables → card list
- Hide/show elements based on viewport

---

## Loading & Empty States

### Loading States
**Never leave users wondering:**
- Skeleton screens matching content layout
- Progress bars for known durations
- Animated placeholders
- Spinners only for short waits (<3s)
- Stagger loading for multiple elements
- Shimmer effects on skeletons

### Empty States
**Make empty states helpful:**
- Illustrations or icons
- Helpful copy explaining why it's empty
- Clear CTA to add first item
- Examples or suggestions
- No "no data" text alone

---

## Unique Elements to Stand Out

### Distinctive Features
**Add personality:**
- Custom cursor effects on landing pages
- Animated page numbers or section indicators
- Unusual hover effects (magnification, distortion)
- Custom scrollbars
- Glassmorphism for overlays
- Animated SVG icons
- Typewriter effects for hero text
- Confetti or celebration animations for actions

### Interactive Elements
**Engage users:**
- Drag-and-drop interfaces
- Sliders and range controls
- Toggle switches with animations
- Progress steps with animations
- Expandable/collapsible sections
- Tabs with slide indicators
- Image comparison sliders
- Interactive demos or playgrounds

---

## Consistency Rules

### Maintain Consistency
**What should stay consistent:**
- Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Border radius values
- Animation timing (200ms, 300ms, 500ms)
- Color system (primary, secondary, accent, neutrals)
- Typography scale
- Icon style (outline vs filled)
- Button styles across the app
- Form element styles

### What Can Vary
**Project-specific customization:**
- Color palette (different colors, same system)
- Layout creativity (grids, asymmetry)
- Illustration style
- Animation personality
- Feature-specific interactions
- Hero section design
- Card styling variations
- Background patterns or textures

---

## Technical Excellence

### Performance
- Optimize images (WebP, lazy loading)
- Code splitting for faster loads
- Debounce search inputs
- Virtualize long lists
- Minimize re-renders
- Use proper memoization

### Accessibility
- Keyboard navigation throughout
- ARIA labels where needed
- Focus indicators visible
- Screen reader friendly
- Sufficient color contrast
- Respect reduced motion preferences

---

## Key Principles

1. **Be Bold** - Don't be afraid to try unique layouts and interactions
2. **Be Consistent** - Use the same patterns for similar functions
3. **Be Responsive** - Design works beautifully on all devices
4. **Be Fast** - Animations are smooth, loading is quick
5. **Be Accessible** - Everyone can use what you build
6. **Be Modern** - Use current design trends and technologies
7. **Be Unique** - Each project should have its own personality
8. **Be Intuitive** - Users shouldn't need instructions


---

# Project-Specific Customizations

**IMPORTANT: This section contains the specific design requirements for THIS project. The guidelines above are universal best practices - these customizations below take precedence for project-specific decisions.**

## User Design Requirements

# Winbro Training Reels - Development Blueprint

Winbro Training Reels is a responsive web platform that preserves operational knowledge via short 20–30s instructional videos ("reels"). It provides searchable, customer-specific video libraries, a course builder with quizzes and certificates, robust admin tools, and enterprise-ready authentication and billing. The system emphasizes fast discovery, standardized metadata, secure per-customer allocation, and scalable video ingestion/playback.

## 1. Pages (UI Screens)

- Landing Page  
  - Purpose: Public marketing, lead capture, and conversion (demo/trial).  
  - Key sections/components: Hero (headline, subheadline, CTAs: Request Demo, Start Trial, hero video thumbnail), Feature Highlights cards, "How It Works" 3-step flow (Record → Tag → Train), Customer logos & testimonials carousel, Pricing Summary with tier CTAs, Footer (Privacy, Terms, Contact, Socials).

- Login / Signup Page  
  - Purpose: Authenticate users and capture new user signups; enterprise SSO initiation and sales contact.  
  - Key sections/components: Login form (email, password, remember me), social/enterprise SSO buttons (SAML/SSO, Google), Signup form (name, company, role, company email, password, subscription selection or request sales), links (Forgot Password, Terms).

- Password Reset Page  
  - Purpose: Secure password recovery flow.  
  - Key sections/components: Request Reset (email), Reset Form (new password, confirm, strength meter), confirmation messages, security notes.

- Email Verification Page  
  - Purpose: Confirm email ownership post-signup or token resend.  
  - Key sections/components: Verification status (success/failure), resend verification button, contact support link, auto-redirect to Dashboard upon success.

- User Dashboard  
  - Purpose: Primary landing for all authenticated users; personalized quick access.  
  - Key sections/components: Top nav (logo, global search, notifications, profile, help), Hero summary stats (courses assigned, reels watched today, cert progress), Assigned courses panel (progress cards, Resume CTA), Recent reels & bookmarks (thumbnails, play, tag chips, add-to-course), Recommended reels, Activity feed, Footer quick links.

- Reel View / Player Page  
  - Purpose: Primary content consumption screen with contextual metadata and actions.  
  - Key sections/components: Adaptive HLS video player (play/pause, speed, captions, timecode), Transcript panel (clickable timestamps, search within transcript), Metadata sidebar (tags, machine model, process, tooling, author, upload date, length), Actions (add-to-course, bookmark, download if permitted, share, report), Related reels list, Comments & annotations (public/private toggle).

- Search & Browse Page  
  - Purpose: Discover reels via full-text and faceted filters.  
  - Key sections/components: Search bar (transcript-aware, typeahead), Filters panel (tags, machine models, process step, duration, created-by, customer scope), Results grid/list (thumbnail, short description, tags, preview on hover, relevance score), Saved searches & filters, Advanced options (boolean search, date ranges, export list).

- Course Builder  
  - Purpose: Create structured training modules from reels and configure quizzes/publishing.  
  - Key sections/components: Course canvas (drag-and-drop reels, modules, reorder), Course settings (title, description, audience, rules, expiry), Quiz editor (question types, timestamp linking, passing score), Publish controls (visibility, assign groups/customers, schedule), Preview & test mode.

- Quiz / Assessment Page  
  - Purpose: Learner assessment UX.  
  - Key sections/components: Question area, timer (optional), progress indicator, submit/back navigation, feedback panel (correctness, explanation, link to reel timestamp), results & certificate issuance.

- Certificates Page  
  - Purpose: View and manage earned certificates.  
  - Key sections/components: Certificate list (thumbnail, course, issue date, expiry, download), verify link, admin revoke/resend controls.

- Create / Upload Content Page  
  - Purpose: Ingest new reels and start QC workflow.  
  - Key sections/components: Upload widget (drag-and-drop, chunked upload, progress), Trim & edit (trim handles, overlay text, auto-thumbnail), Metadata form (title, description, machine model, process, tooling, tags, allocation), Auto-transcription & auto-tagging status, Submit for QA (assign reviewers, save draft).

- Manage Content Page  
  - Purpose: Curate, approve, allocate and archive content.  
  - Key sections/components: Content table (status, tags, assigned customers, actions), bulk actions (tag, assign, publish), content audit log (history, uploader, QA notes).

- Admin Dashboard  
  - Purpose: Operational overview for admins and account managers.  
  - Key sections/components: KPIs panel (reels produced, plays, watch time, course completions), content pipeline (pending QA, flagged reels), user overview (active users, invites), system health (CDN/transcode queue, storage), quick actions.

- User Profile Page  
  - Purpose: Personal settings and security.  
  - Key sections/components: Profile info (avatar, role, company), preferences (language, playback defaults, theme), security (change password, 2FA, active sessions), subscriptions & billing link.

- Settings / Preferences Page  
  - Purpose: Org-level configuration for admins.  
  - Key sections/components: Organization info, SSO & security (SAML config, SCIM, password policy), content allocation rules, branding (logo, colors), billing & seats.

- About / Help Page  
  - Purpose: Documentation and support.  
  - Key sections/components: Knowledge base, best practices (recording checklist), FAQs, support form (attach reel/screenshot).

- Checkout / Payment Page  
  - Purpose: Secure payment and subscription management.  
  - Key sections/components: Pricing summary, Stripe Elements card input, billing address, promo code, receipt toggle, confirmation.

- Order / Transaction History Page  
  - Purpose: Billing history and subscription management.  
  - Key sections/components: Invoices list, subscription summary (plan, next bill, seats), payment methods (manage via provider).

- Privacy Policy Page  
  - Purpose: Legal data processing disclosure.  
  - Key sections/components: Full privacy text, contact for data requests.

- Terms of Service Page  
  - Purpose: Contractual terms and content ownership.  
  - Key sections/components: Full TOS, accept checkbox during signup.

- Cookie Policy Page  
  - Purpose: Consent management.  
  - Key sections/components: Cookie categories with toggles, consent log.

- 404 Not Found Page  
  - Purpose: Friendly error for missing pages.  
  - Key sections/components: Message, search field, navigation links, contact support.

- 500 Server Error Page  
  - Purpose: Friendly server error page with support path.  
  - Key sections/components: Retry button, contact support, request ID display.

- Loading / Success Pages  
  - Purpose: Contextual feedback for async operations.  
  - Key sections/components: Loading spinners/progress bars, success banners with next-step CTAs.

## 2. Features

- User Authentication & Security  
  - Technical details: JWT access + refresh token model; tokens delivered via secure httpOnly cookies (or Authorization header for API clients). Password hashing with bcrypt/Argon2. Email verification tokens and password reset tokens with short TTL stored hashed in DB. Optional TOTP 2FA and recovery codes. Rate limiting and brute-force protection (IP + account). RBAC supports roles: admin, curator, trainer, operator, customer-admin. SAML 2.0 / OAuth/OIDC for enterprise SSO and SCIM for provisioning. Session invalidation on password reset and administrative logout.

- Video Upload, Transcoding & Storage  
  - Technical details: Chunked resumable uploads using tus or multipart to S3 pre-signed URLs. Background worker (serverless or containerized) picks up uploaded files and transcodes via ffmpeg to multi-bitrate HLS + thumbnails + poster images. Store raw + transcoded variants with lifecycle rules. Generate signed CloudFront URLs for playback. Include virus scanning step before ingest job. Emit metadata (duration, resolution, codecs) to DB. Transcoding & thumbnail generation scale via worker autoscaling and queue (SQS/RabbitMQ). Provide upload progress, retry/chunk resume, and client-side trimming where feasible.

- Automated Transcription & AI Tagging  
  - Technical details: On successful ingest, push audio to ASR (AWS Transcribe / Whisper-based) for timestamped transcript with punctuation; optionally speaker diarization. Run NLP entity extraction (OpenAI/custom model) to extract machine models, tooling, process steps, and suggested tags. Store transcripts in relational DB and indexed in search engine with timestamps. Provide UI for human-in-the-loop edits; edited transcripts update search index. Suggest auto-tags; curator can accept/reject.

- Search & Filter Functionality  
  - Technical details: Use Elasticsearch/OpenSearch/Algolia for indexing metadata and transcripts. Index domain vocabulary (custom analyzers, token filters) and mass synonyms for machine names. Implement faceted filters for tags, machine models, process step, durations, date ranges. Provide typeahead endpoint using recently popular queries and user's recent searches. Support boolean syntax for advanced searches. Use cursor-based pagination for performance and cache popular queries in Redis.

- Course Builder & Learning Management  
  - Technical details: Course & module schema supports ordered items with unique identifiers and optional prerequisites. Quiz engine supports MCQ, True/False, short answer with timestamp links to reels; store attempts with answers, scores, timestamps. Completion rules: require viewing X% of reels OR passing quiz. Certificate generation uses templated HTML -> PDF (Puppeteer/wkhtmltopdf) with QR (verification URL). Assign courses to groups/customers; store progress events and emit completion events to analytics and via webhooks. Enable preview/test mode that simulates learner experience.

- Notifications & Communication  
  - Technical details: Notification service supports in-app (WebSockets or SSE) and email (SendGrid/Mailgun). Template-driven notifications for assignments, certificate issuance, account actions. User preferences stored for channel choices. Use a message queue with retry and dead-letter handling for failures.

- Billing & Subscription Management  
  - Technical details: Integrate Stripe for subscriptions and one-off purchases. Use seat-based model with proration on seat changes; implement webhooks for payment succeeded/failed, invoice events. Admin UI surfaces invoices and seat usage and allows seat adjustments. Do not store full card data; use Stripe Elements for PCI compliance.

- Admin Tools & Content Moderation  
  - Technical details: RBAC-protected admin portal with content QA workflow: states (draft, pending QA, approved, published, archived). Flagging system with review queues and audit logs for actions (who edited/approved). Bulk operations for tagging/assignments. Exportable reports (CSV/PDF) and UI for revoking certificates.

- Performance, Caching & Scalability  
  - Technical details: CDN for asset delivery (CloudFront), adaptive HLS for bandwidth management. Redis cache for metadata, session store, and hot queries; cache search result shards where applicable. Autoscale workers for transcoding and background jobs. Monitoring via Prometheus/Grafana, logs to ELK. Backup/DR: daily DB backups, object storage replication, tested restore processes with defined RTO/RPO.

- External Integrations & APIs  
  - Technical details: ASR/NLP, CDN, Stripe, Email, SAML/SCIM, Search engine integrations. Provide secure API keys and OAuth for partner integrations. Implement webhooks endpoints with signature verification and idempotency keys.

- Security & Compliance Features  
  - Technical details: Per-customer tenancy and ACL at object and API layer. Signed playback URLs with expiry, encrypted at rest on S3. Audit logs for critical events, data retention policies, and cookie consent compliance. Implement HTTPS everywhere, CSP, secure headers, and regular dependency scanning.

## 3. User Journeys

- Operator (learner) — Watch a reel and complete course  
  1. Operator logs in via email/password or enterprise SSO.  
  2. Lands on Dashboard; sees assigned course card.  
  3. Clicks Resume → Course builder preview or direct course player.  
  4. Plays 20–30s reels; toggles captions or clicks transcript timestamps to jump.  
  5. Marks notes or comments (private or team-visible).  
  6. Completes the required reels and takes quiz; submits answers.  
  7. If passed, receives certificate; certificate appears in Certificates page and is emailed.  
  8. Progress events logged; trainer/admin notified if configured.

- Trainer (content creator) — Build and publish a course  
  1. Trainer logs in and navigates to Create / Upload Content.  
  2. Uploads new reel(s) via drag-and-drop; trims and edits thumbnail.  
  3. Adds metadata, accepts/edits auto-transcript and suggested tags, submits for QA.  
  4. After approval, opens Course Builder, drags reels into modules, orders content.  
  5. Creates quiz questions and links questions to reel timestamps.  
  6. Sets completion rules and target audience (customer group).  
  7. Publishes course (visibility: customer-specific). Trainer receives publish confirmation.

- Winbro Admin (curator/account manager) — Approve content and allocate to customer  
  1. Admin receives notification of pending QA uploads.  
  2. Goes to Manage Content, previews reel, edits metadata or transcript if needed.  
  3. Approves and assigns reels to specific customer subscriptions/libraries.  
  4. Optionally bundles reels into content packs or assigns to courses.  
  5. Monitors usage on Admin Dashboard and acts on flags or support tickets.

- Customer Admin — Manage seats and user provisioning  
  1. Customer-admin accesses Settings → Billing & Seats.  
  2. Views seat usage and invoices. Adds seats (via checkout/Stripe) or requests upgrade.  
  3. Configures SSO via SAML/SCIM provisioning (uploads IdP metadata) or invites users manually.  
  4. Sets default content allocation rules for machine types.

- Anonymous User — Marketing to conversion  
  1. Lands on Landing Page from search/ads.  
  2. Watches demo reel and reads features.  
  3. Clicks Request Demo (leads to contact form) or Start Trial (redirect to signup).

- Admin QA Flow with Flags  
  1. Content submitted enters "pending QA" queue.  
  2. Curator inspects and either approves, requests edits, or rejects (with comments).  
  3. If edits requested, uploader receives notification and updates reel.  
  4. Once approved, assigned customers or groups receive notification per allocation rules.

## 4. UI Guide

- Color palette  
  - Primary: #0B5FFF (Winbro Blue) — CTA, primary actions.  
  - Secondary: #00A676 (Accent Green) — Success states, secondary CTAs.  
  - Neutral dark: #111827 — Headings and primary UI text.  
  - Neutral mid: #6B7280 — Secondary text and captions.  
  - Neutral light: #F3F4F6 — Background surfaces.  
  - Danger: #EF4444 — Errors, destructive actions.  
  - Info: #0EA5E9 — Informational highlights.

- Typography  
  - Brand font: Inter (system fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto).  
  - Scale: H1 32px/40px weight 700; H2 24px/32px weight 600; H3 18px/24px weight 600; Body 16px/24px weight 400; Small/captions 12px/16px weight 400.  
  - Line-length: target 60–75 characters for body text. Use 1.4–1.6 line-height for body.

- Component specs  
  - Buttons: primary (filled Winbro Blue, white text, 8px radius), secondary (outline with Winbro Blue border), ghost (text only). Disabled state = 50% opacity. Sizes: small (32px), default (40px), large (48px).  
  - Input fields: 40px height, 8px radius, 1px neutral border, focus ring using primary color (2px). Show inline validation messages.  
  - Cards: subtle shadow (0 1px 3px rgba(17,24,39,0.06)), 12px padding, 8px radius. Reel cards include 16:9 thumbnail, title, 2-line description, tag chips.  
  - Tag chips: small rounded pills (bg neutral-light, text neutral-dark), include filter state (active = primary filled).  
  - Modals: centered, max-width 840px for editor flows, overlay 40% black with blur disabled for performance.  
  - Video player: responsive container (max width 1280px), controls overlay lower third, speed control and CC toggles visible in control bar. Closed captions default to off but autoplay preference stored in profile. Use HLS.js or native HLS where available.  
  - Transcript panel: monospace timecodes aligned left; clickable timestamps become active link UI. Search within transcript highlights matched words and shows timestamped snippets.

- Layout principles  
  - Grid: 12-column responsive grid. Desktop gutter 24px, tablet 16px, mobile single column.  
  - Spacing: Base spacing unit 8px. Use multiples for padding/margins.  
  - Responsive breakpoints: Mobile <= 640px, Tablet 641–1024px, Desktop >1024px. Prioritize main content (player/search results) on small screens and move sidebars to collapsible drawers.

- Visual style & mood  
  - Professional, technical, and approachable. High contrast for clarity in shop-floor lighting. Use real imagery from sample reels for hero visuals and testimonials. Animations subtle: fades, micro-interactions on hover, and soft slide-ins for panels. Avoid heavy decorative elements; focus on clarity and legibility.

- Component patterns  
  - Reusable card for reels and courses with consistent action placement (top-right kebab menu for secondary actions).  
  - Persistent top nav with sticky search that expands on focus.  
  - Drawer panels for metadata/filters on mobile to preserve screen real estate.  
  - Confirmation dialogs for destructive admin actions with typed confirmation for high-risk ops (e.g., revoke certificate).  
  - Inline editing for simple metadata fields (title, short description) with autosave and undo.

- Accessibility & Interaction  
  - WCAG AA compliance as baseline: color contrast, keyboard navigation, ARIA labels on controls, focus states visible.  
  - Captions and transcripts required for all reels. Player controls accessible and operable without mouse. Provide skip links for keyboard users.

Instructions to AI Development Tool
After every development step, refer back to this blueprint to ensure correct implementation. Verify all features and pages are built according to specifications before completing the project. Pay special attention to the UI Guide section and ensure all visual elements follow the design system exactly.

## Implementation Notes

When implementing this project:

1. **Follow Universal Guidelines**: Use the design best practices documented above as your foundation
2. **Apply Project Customizations**: Implement the specific design requirements stated in the "User Design Requirements" section
3. **Priority Order**: Project-specific requirements override universal guidelines when there's a conflict
4. **Color System**: Extract and implement color values as CSS custom properties in HSL format
5. **Typography**: Define font families, sizes, and weights based on specifications
6. **Spacing**: Establish consistent spacing scale following the design system
7. **Components**: Style all Shadcn components to match the design aesthetic
8. **Animations**: Use Motion library for transitions matching the design personality
9. **Responsive Design**: Ensure mobile-first responsive implementation

## Implementation Checklist

- [ ] Review universal design guidelines above
- [ ] Extract project-specific color palette and define CSS variables
- [ ] Configure Tailwind theme with custom colors
- [ ] Set up typography system (fonts, sizes, weights)
- [ ] Define spacing and sizing scales
- [ ] Create component variants matching design
- [ ] Implement responsive breakpoints
- [ ] Add animations and transitions
- [ ] Ensure accessibility standards
- [ ] Validate against user design requirements

---

**Remember: Always reference this file for design decisions. Do not use generic or placeholder designs.**
