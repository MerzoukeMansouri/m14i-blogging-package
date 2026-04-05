import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogPreview } from "../src/components/BlogPreview";
import type { LayoutSection } from "../src/types";

const meta: Meta<typeof BlogPreview> = {
  title: "Advanced Use Cases/Feature Combinations",
  component: BlogPreview,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Advanced Use Cases

These examples demonstrate advanced combinations of features, showing the full flexibility and power of the blogging system.

## What's Showcased

- **Mixed Media Posts** - Combining text, images, videos, PDFs, quotes, and carousels
- **Rich Landing Pages** - Marketing-style content with grids and multimedia
- **Event Pages** - Announcements with schedules, speakers, and registration
- **Course Content** - Educational material with chapters and resources
- **Press Releases** - Professional announcements with media kits
- **Case Studies** - In-depth project showcases

These examples show how different content types work together seamlessly.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BlogPreview>;

// Rich Mixed Media Blog Post
export const MixedMediaPost: Story = {
  name: "🎬 Rich Media Blog Post",
  args: {
    title: "Product Launch: Behind the Scenes",
    sections: [
      {
        id: "intro",
        type: "1-column",
        columns: [
          [
            {
              id: "intro-text",
              type: "text",
              content: `# Behind the Scenes of Our Product Launch

Take an exclusive look at how we built and launched our newest product.

**Published:** March 15, 2024 · **Category:** Product · **Reading Time:** 8 min`,
            },
          ],
        ],
      },
      {
        id: "hero-video",
        type: "1-column",
        columns: [
          [
            {
              id: "video-1",
              type: "video",
              url: "https://www.w3schools.com/html/mov_bbb.mp4",
              title: "Product Launch Recap",
              description: "Watch highlights from our launch event",
              thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
            },
          ],
        ],
      },
      {
        id: "story",
        type: "2-columns",
        columns: [
          [
            {
              id: "journey",
              type: "text",
              content: `## The Journey

What started as a simple idea evolved into a year-long journey of research, development, and refinement.

### Timeline
- **Q1 2023:** Initial concept and market research
- **Q2 2023:** Design and prototyping
- **Q3 2023:** Development and testing
- **Q4 2023:** Beta program
- **Q1 2024:** Public launch

Each phase taught us valuable lessons about our users and their needs.`,
            },
          ],
          [
            {
              id: "team-image",
              type: "image",
              src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
              alt: "Team collaboration",
              caption: "Our team during the design sprint",
            },
          ],
        ],
      },
      {
        id: "team-quote",
        type: "1-column",
        columns: [
          [
            {
              id: "ceo-quote",
              type: "quote",
              content: "This product represents everything we believe in: simplicity, power, and user-first design. I couldn't be prouder of what the team accomplished.",
              author: "Sarah Kim",
              role: "CEO & Founder",
            },
          ],
        ],
      },
      {
        id: "gallery",
        type: "1-column",
        columns: [
          [
            {
              id: "gallery-title",
              type: "text",
              content: "## Photo Gallery",
            },
            {
              id: "carousel",
              type: "carousel",
              slides: [
                {
                  src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
                  alt: "Analytics",
                  title: "Early Prototypes",
                  caption: "First designs on the whiteboard",
                },
                {
                  src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200",
                  alt: "Team meeting",
                  title: "Sprint Planning",
                  caption: "Weekly team sync",
                },
                {
                  src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200",
                  alt: "Launch event",
                  title: "Launch Day",
                  caption: "Celebrating with the team",
                },
              ],
              autoPlay: true,
              autoPlayInterval: 3500,
              showDots: true,
              showArrows: true,
              loop: true,
              aspectRatio: "16/9",
            },
          ],
        ],
      },
      {
        id: "features",
        type: "grid-2x3",
        columns: [
          [
            {
              id: "f1",
              type: "text",
              content: "### 🚀 Lightning Fast\n\nBuilt from the ground up for performance. Sub-second load times guaranteed.",
            },
          ],
          [
            {
              id: "f2",
              type: "text",
              content: "### 🎨 Beautiful UI\n\nPixel-perfect design that users love. Every detail matters.",
            },
          ],
          [
            {
              id: "f3",
              type: "text",
              content: "### 🔒 Secure\n\nEnterprise-grade security. Your data is always protected.",
            },
          ],
          [
            {
              id: "f4",
              type: "text",
              content: "### 📱 Mobile First\n\nOptimized for all devices. Native app experience.",
            },
          ],
          [
            {
              id: "f5",
              type: "text",
              content: "### 🔌 Integrations\n\nConnect with your favorite tools seamlessly.",
            },
          ],
          [
            {
              id: "f6",
              type: "text",
              content: "### 💬 Support 24/7\n\nAlways here to help. Real humans, real time.",
            },
          ],
        ],
      },
      {
        id: "resources",
        type: "1-column",
        columns: [
          [
            {
              id: "resources-text",
              type: "text",
              content: "## Press & Resources",
            },
            {
              id: "press-kit",
              type: "pdf",
              url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
              title: "Press Kit & Media Assets",
              description: "Download our complete press kit including logos, screenshots, and fact sheet",
              displayMode: "download",
            },
          ],
        ],
      },
    ],
  },
};

// Event Announcement
export const EventAnnouncement: Story = {
  name: "🎤 Event/Conference Page",
  args: {
    title: "TechConf 2024 - Join Us This Summer!",
    sections: [
      {
        id: "hero",
        type: "1-column",
        columns: [
          [
            {
              id: "hero-image",
              type: "image",
              src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200",
              alt: "Conference venue",
              caption: "Silicon Valley Convention Center",
            },
            {
              id: "hero-text",
              type: "text",
              content: `# TechConf 2024

## The Premier Technology Conference

**June 15-17, 2024 · Silicon Valley Convention Center**

Join 5,000+ developers, designers, and tech leaders for three days of learning, networking, and innovation.

🎟️ **[Register Now](#)** · Early bird pricing ends March 31st`,
            },
          ],
        ],
      },
      {
        id: "about",
        type: "2-columns",
        columns: [
          [
            {
              id: "about-text",
              type: "text",
              content: `## Why Attend?

TechConf brings together the brightest minds in technology for an unforgettable experience.

### What to Expect

- **50+ Sessions** across 6 tracks
- **Hands-on Workshops** with industry experts
- **Networking Events** with peers and leaders
- **Exhibition Hall** featuring 100+ companies
- **After Parties** and social events

### Who Should Attend

- Software Engineers
- Product Managers
- UX/UI Designers
- Tech Leaders & CTOs
- Entrepreneurs`,
            },
          ],
          [
            {
              id: "promo-video",
              type: "video",
              url: "https://www.w3schools.com/html/mov_bbb.mp4",
              title: "TechConf 2023 Highlights",
              description: "See what happened last year",
              thumbnail: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600",
            },
          ],
        ],
      },
      {
        id: "speakers-title",
        type: "1-column",
        columns: [
          [
            {
              id: "speakers-heading",
              type: "text",
              content: "## Featured Speakers",
            },
          ],
        ],
      },
      {
        id: "speakers",
        type: "grid-3x3",
        columns: [
          [
            {
              id: "speaker1",
              type: "text",
              content: "**Keynote**\n\n_Dr. Jane Smith_\n\nCEO, TechCorp\n\n\"The Future of AI\"",
            },
          ],
          [
            {
              id: "speaker2",
              type: "text",
              content: "**Track Lead**\n\n_John Doe_\n\nVP Eng, StartupXYZ\n\n\"Scaling Systems\"",
            },
          ],
          [
            {
              id: "speaker3",
              type: "text",
              content: "**Workshop**\n\n_Emily Chen_\n\nDesign Director\n\n\"UX Masterclass\"",
            },
          ],
          [
            {
              id: "speaker4",
              type: "text",
              content: "**Panel**\n\n_Mike Johnson_\n\nCTO, BigCo\n\n\"Cloud Strategy\"",
            },
          ],
          [
            {
              id: "speaker5",
              type: "text",
              content: "**Session**\n\n_Sarah Lee_\n\nSenior Architect\n\n\"Microservices\"",
            },
          ],
          [
            {
              id: "speaker6",
              type: "text",
              content: "**Keynote**\n\n_David Park_\n\nFounder, DevTools\n\n\"Developer Tools\"",
            },
          ],
          [
            {
              id: "speaker7",
              type: "text",
              content: "**Workshop**\n\n_Lisa Wang_\n\nSecurity Expert\n\n\"AppSec 101\"",
            },
          ],
          [
            {
              id: "more",
              type: "text",
              content: "**+50 More**\n\nSpeakers\n\n[View Full Schedule](#)",
            },
          ],
          [
            {
              id: "speaker8",
              type: "text",
              content: "**Panel**\n\n_Tom Brown_\n\nProduct Lead\n\n\"Product Strategy\"",
            },
          ],
        ],
      },
      {
        id: "schedule",
        type: "3-columns",
        columns: [
          [
            {
              id: "day1",
              type: "text",
              content: `### Day 1 - June 15

**9:00 AM** Registration

**10:00 AM** Keynote

**11:30 AM** Sessions Begin

**1:00 PM** Lunch

**2:00 PM** Workshops

**6:00 PM** Welcome Party`,
            },
          ],
          [
            {
              id: "day2",
              type: "text",
              content: `### Day 2 - June 16

**9:00 AM** Keynote

**10:30 AM** Sessions

**12:00 PM** Lunch

**1:30 PM** Workshops

**6:00 PM** Expo Hall

**8:00 PM** Networking`,
            },
          ],
          [
            {
              id: "day3",
              type: "text",
              content: `### Day 3 - June 17

**9:00 AM** Sessions

**11:00 AM** Panels

**12:30 PM** Lunch

**2:00 PM** Workshops

**4:00 PM** Closing

**5:00 PM** After Party`,
            },
          ],
        ],
      },
      {
        id: "sponsors",
        type: "1-column",
        columns: [
          [
            {
              id: "sponsors-text",
              type: "text",
              content: "## Sponsors & Partners",
            },
            {
              id: "sponsor-logos",
              type: "image",
              src: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1200",
              alt: "Sponsor logos",
              caption: "Platinum Sponsors: TechCorp, DataCo, CloudInc, AILabs",
            },
          ],
        ],
      },
      {
        id: "tickets",
        type: "grid-2x2",
        columns: [
          [
            {
              id: "early",
              type: "text",
              content: `### Early Bird

**$599**

✅ All sessions
✅ Workshops
✅ Exhibition access
✅ Networking events
✅ Conference materials

_Ends March 31st_

[Register →](#)`,
            },
          ],
          [
            {
              id: "regular",
              type: "text",
              content: `### Regular

**$799**

✅ All sessions
✅ Workshops
✅ Exhibition access
✅ Networking events
✅ Conference materials

_Available now_

[Register →](#)`,
            },
          ],
          [
            {
              id: "vip",
              type: "text",
              content: `### VIP Pass

**$1,499**

✅ Everything in Regular
✅ VIP lounge access
✅ Private meet & greets
✅ Premium seating
✅ Exclusive dinners

[Register →](#)`,
            },
          ],
          [
            {
              id: "group",
              type: "text",
              content: `### Team (5+)

**$2,499**

Save 20% with groups

✅ 5 regular passes
✅ Team training session
✅ Dedicated support

[Contact Sales →](#)`,
            },
          ],
        ],
      },
      {
        id: "testimonials",
        type: "1-column",
        columns: [
          [
            {
              id: "testimonial",
              type: "quote",
              content: "TechConf 2023 was incredible! The sessions were world-class, and I made connections that led to our next funding round. Can't wait for 2024!",
              author: "Alex Rivera",
              role: "Founder, StartupCo",
            },
          ],
        ],
      },
      {
        id: "location",
        type: "2-columns",
        columns: [
          [
            {
              id: "venue-info",
              type: "text",
              content: `## Venue & Location

**Silicon Valley Convention Center**
123 Tech Drive
San Jose, CA 95110

### Getting There

🚗 **Driving:** Free parking available
✈️ **Airport:** 15 min from SJC
🚊 **Public Transit:** Light rail to Convention Center stop

### Hotels

We've secured special rates at nearby hotels. Book through our portal for 20% off.`,
            },
          ],
          [
            {
              id: "venue-image",
              type: "image",
              src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
              alt: "Convention center",
              caption: "Modern 500,000 sq ft facility",
            },
          ],
        ],
      },
    ],
  },
};

// Online Course/Tutorial
export const OnlineCourse: Story = {
  name: "📚 Course/Tutorial Content",
  args: {
    title: "Master React in 30 Days - Complete Course",
    sections: [
      {
        id: "intro",
        type: "1-column",
        columns: [
          [
            {
              id: "course-intro",
              type: "text",
              content: `# Master React in 30 Days

## From Beginner to Production-Ready Developer

Learn React the right way with hands-on projects, real-world examples, and best practices.

**Duration:** 30 days · **Level:** Beginner to Advanced · **Students:** 15,000+

⭐ **4.9/5** rating · 🎓 **Certificate included** · 🔄 **Lifetime access**

[Enroll Now - $79 →](#)`,
            },
          ],
        ],
      },
      {
        id: "overview",
        type: "2-columns",
        columns: [
          [
            {
              id: "what-learn",
              type: "text",
              content: `## What You'll Learn

By the end of this course, you'll be able to:

✅ **Build complete React applications** from scratch
✅ **Master React Hooks** and modern patterns
✅ **Manage complex state** with Context, Redux, Zustand
✅ **Connect to APIs** and handle async operations
✅ **Style components** with CSS-in-JS, Tailwind, etc.
✅ **Test your apps** with Jest and React Testing Library
✅ **Deploy to production** on Vercel, Netlify, AWS
✅ **Optimize performance** for real-world apps

### Prerequisites

- Basic JavaScript knowledge
- Familiarity with HTML/CSS
- Willingness to learn!`,
            },
          ],
          [
            {
              id: "instructor-video",
              type: "video",
              url: "https://www.w3schools.com/html/mov_bbb.mp4",
              title: "Course Introduction",
              description: "Meet your instructor and learn about the course structure",
              thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600",
            },
          ],
        ],
      },
      {
        id: "curriculum",
        type: "1-column",
        columns: [
          [
            {
              id: "curriculum-title",
              type: "text",
              content: "## Course Curriculum",
            },
          ],
        ],
      },
      {
        id: "weeks",
        type: "grid-2x2",
        columns: [
          [
            {
              id: "week1",
              type: "text",
              content: `### Week 1: Fundamentals

**Days 1-7**

- React basics & JSX
- Components & Props
- State & Events
- Lists & Keys
- Forms & Controlled Inputs

**Project:** Todo App`,
            },
          ],
          [
            {
              id: "week2",
              type: "text",
              content: `### Week 2: Hooks Deep Dive

**Days 8-14**

- useState & useEffect
- useContext & useReducer
- useMemo & useCallback
- Custom Hooks
- Hook patterns

**Project:** Weather App`,
            },
          ],
          [
            {
              id: "week3",
              type: "text",
              content: `### Week 3: Advanced Topics

**Days 15-21**

- State Management (Redux)
- API Integration
- Routing with React Router
- Authentication
- Error Boundaries

**Project:** E-commerce Store`,
            },
          ],
          [
            {
              id: "week4",
              type: "text",
              content: `### Week 4: Production Ready

**Days 22-30**

- Testing strategies
- Performance optimization
- Accessibility (a11y)
- Deployment & CI/CD
- Best practices

**Project:** Full-Stack Dashboard`,
            },
          ],
        ],
      },
      {
        id: "instructor",
        type: "2-columns",
        columns: [
          [
            {
              id: "instructor-bio",
              type: "text",
              content: `## Your Instructor

**Sarah Johnson**
Senior React Developer & Tech Educator

With 10+ years of experience building React applications for companies like Facebook, Airbnb, and startups, I've taught over 50,000 students worldwide.

### Why Learn from Me?

- 🏆 React core contributor
- 📖 Author of "React Best Practices"
- 🎤 Speaker at React Conf
- 💼 Led teams at top tech companies
- ❤️ Passionate about teaching

I believe in learning by doing. This course is packed with practical examples and real projects you'll be proud to show.`,
            },
          ],
          [
            {
              id: "instructor-image",
              type: "image",
              src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600",
              alt: "Instructor",
              caption: "Sarah Johnson - Your React Mentor",
            },
          ],
        ],
      },
      {
        id: "testimonials-title",
        type: "1-column",
        columns: [
          [
            {
              id: "testimonials-heading",
              type: "text",
              content: "## Student Success Stories",
            },
          ],
        ],
      },
      {
        id: "testimonials",
        type: "3-columns",
        columns: [
          [
            {
              id: "t1",
              type: "quote",
              content: "This course changed my career. I went from knowing nothing about React to landing a senior developer job. Sarah's teaching style is incredible!",
              author: "Michael Chen",
              role: "Senior Developer @ TechCorp",
            },
          ],
          [
            {
              id: "t2",
              type: "quote",
              content: "Best React course I've ever taken. The projects are practical and the explanations are crystal clear. Worth every penny!",
              author: "Jessica Park",
              role: "Frontend Engineer @ StartupXYZ",
            },
          ],
          [
            {
              id: "t3",
              type: "quote",
              content: "Finally, a course that teaches modern React the right way. No outdated patterns, just best practices and real-world examples.",
              author: "David Liu",
              role: "Full-Stack Developer",
            },
          ],
        ],
      },
      {
        id: "bonuses",
        type: "1-column",
        columns: [
          [
            {
              id: "bonuses-text",
              type: "text",
              content: "## Course Bonuses",
            },
          ],
        ],
      },
      {
        id: "bonus-grid",
        type: "grid-2x3",
        columns: [
          [
            {
              id: "b1",
              type: "text",
              content: "### 📄 Source Code\n\nAccess to all project source code and solutions",
            },
          ],
          [
            {
              id: "b2",
              type: "text",
              content: "### 💬 Private Community\n\nJoin our Discord with 15k+ React developers",
            },
          ],
          [
            {
              id: "b3",
              type: "text",
              content: "### 🎥 Video Library\n\n50+ hours of content, forever updated",
            },
          ],
          [
            {
              id: "b4",
              type: "text",
              content: "### 📚 Resource Pack\n\nCheat sheets, diagrams, and guides (PDF)",
            },
          ],
          [
            {
              id: "b5",
              type: "text",
              content: "### 🏆 Certificate\n\nVerifiable completion certificate",
            },
          ],
          [
            {
              id: "b6",
              type: "text",
              content: "### 🔄 Free Updates\n\nLifetime access to all future updates",
            },
          ],
        ],
      },
      {
        id: "resources",
        type: "1-column",
        columns: [
          [
            {
              id: "syllabus",
              type: "pdf",
              url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
              title: "Complete Course Syllabus",
              description: "Download the full 30-day curriculum with detailed lesson plans",
              displayMode: "both",
            },
          ],
        ],
      },
      {
        id: "faq",
        type: "2-columns",
        columns: [
          [
            {
              id: "faq-left",
              type: "text",
              content: `## FAQ

**Do I need prior React experience?**
No! We start from the very basics and build up gradually.

**How long do I have access?**
Lifetime access. Learn at your own pace.

**Is there a money-back guarantee?**
Yes! 30-day full refund, no questions asked.`,
            },
          ],
          [
            {
              id: "faq-right",
              type: "text",
              content: `**What if I get stuck?**
Ask questions in our community or office hours.

**Are the projects real-world?**
Absolutely. They're based on actual production apps.

**Will I get a certificate?**
Yes, upon completion you'll get a verified certificate.`,
            },
          ],
        ],
      },
      {
        id: "cta",
        type: "1-column",
        columns: [
          [
            {
              id: "cta-text",
              type: "text",
              content: `## Ready to Master React?

Join 15,000+ students who've transformed their careers with this course.

**Limited Time Offer:** Use code REACT2024 for 40% off

~~$129~~ **$79** for lifetime access

[Enroll Now →](#) · 30-day money-back guarantee`,
            },
          ],
        ],
      },
    ],
  },
};

// Case Study
export const CaseStudy: Story = {
  name: "📊 Case Study / Success Story",
  args: {
    title: "How AcmeCorp Increased Revenue by 300% with Our Platform",
    sections: [
      {
        id: "header",
        type: "1-column",
        columns: [
          [
            {
              id: "title",
              type: "text",
              content: `# Case Study: AcmeCorp

## How We Helped Increase Revenue by 300% in 6 Months

**Industry:** E-commerce · **Company Size:** 50-200 employees · **Location:** San Francisco, CA`,
            },
            {
              id: "hero-image",
              type: "image",
              src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
              alt: "AcmeCorp dashboard",
              caption: "AcmeCorp's analytics dashboard showing growth metrics",
            },
          ],
        ],
      },
      {
        id: "summary",
        type: "1-column",
        columns: [
          [
            {
              id: "summary-text",
              type: "text",
              content: `## Executive Summary

AcmeCorp, a mid-sized e-commerce company, was struggling with slow growth and outdated technology. After implementing our platform, they saw:

- 📈 **300% revenue increase** in 6 months
- ⚡ **60% faster page loads** improving conversions
- 👥 **40% more returning customers**
- 💰 **$2M+ in additional revenue**
- ⏱️ **75% reduction** in manual reporting time

Read on to learn how we achieved these results together.`,
            },
          ],
        ],
      },
      {
        id: "quote-ceo",
        type: "1-column",
        columns: [
          [
            {
              id: "ceo-quote",
              type: "quote",
              content: "Partnering with them was the best business decision we made. The ROI was evident within the first month, and it's only gotten better since.",
              author: "James Chen",
              role: "CEO, AcmeCorp",
            },
          ],
        ],
      },
      {
        id: "challenge",
        type: "2-columns",
        columns: [
          [
            {
              id: "challenge-text",
              type: "text",
              content: `## The Challenge

AcmeCorp faced several critical issues:

### Technical Debt
Their legacy system was built 8 years ago and couldn't scale with growing demand.

### Poor Performance
Page load times averaged 8+ seconds, leading to high bounce rates.

### Limited Insights
No real-time analytics meant decisions were made on gut feeling rather than data.

### Manual Processes
The team spent 20+ hours per week on manual reporting and inventory management.

### Customer Churn
Customers were frustrated with the slow, buggy experience and were leaving for competitors.`,
            },
          ],
          [
            {
              id: "challenge-image",
              type: "image",
              src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
              alt: "Problem analysis",
              caption: "Initial performance audit showing bottlenecks",
            },
          ],
        ],
      },
      {
        id: "solution",
        type: "1-column",
        columns: [
          [
            {
              id: "solution-title",
              type: "text",
              content: "## Our Solution",
            },
          ],
        ],
      },
      {
        id: "solution-grid",
        type: "grid-2x3",
        columns: [
          [
            {
              id: "s1",
              type: "text",
              content: "### Phase 1: Discovery\n\n**Week 1-2**\n\nIn-depth analysis of existing systems, user journeys, and business goals.",
            },
          ],
          [
            {
              id: "s2",
              type: "text",
              content: "### Phase 2: Migration\n\n**Week 3-6**\n\nSeamless migration to our platform with zero downtime.",
            },
          ],
          [
            {
              id: "s3",
              type: "text",
              content: "### Phase 3: Optimization\n\n**Week 7-10**\n\nPerformance tuning, A/B testing, and feature rollout.",
            },
          ],
          [
            {
              id: "s4",
              type: "text",
              content: "### Phase 4: Training\n\n**Week 11-12**\n\nTeam onboarding and best practices workshops.",
            },
          ],
          [
            {
              id: "s5",
              type: "text",
              content: "### Phase 5: Launch\n\n**Week 13**\n\nFull launch with monitoring and support.",
            },
          ],
          [
            {
              id: "s6",
              type: "text",
              content: "### Phase 6: Growth\n\n**Ongoing**\n\nContinuous optimization and feature development.",
            },
          ],
        ],
      },
      {
        id: "results",
        type: "1-column",
        columns: [
          [
            {
              id: "results-title",
              type: "text",
              content: "## Results",
            },
          ],
        ],
      },
      {
        id: "results-stats",
        type: "grid-4-even",
        columns: [
          [
            {
              id: "stat1",
              type: "text",
              content: "## 300%\n\n**Revenue Growth**\n\nIn just 6 months",
            },
          ],
          [
            {
              id: "stat2",
              type: "text",
              content: "## 1.2s\n\n**Page Load Time**\n\nDown from 8+ seconds",
            },
          ],
          [
            {
              id: "stat3",
              type: "text",
              content: "## 85%\n\n**Customer Satisfaction**\n\nUp from 62%",
            },
          ],
          [
            {
              id: "stat4",
              type: "text",
              content: "## $2M+\n\n**Additional Revenue**\n\nIn first 6 months",
            },
          ],
        ],
      },
      {
        id: "before-after",
        type: "2-columns",
        columns: [
          [
            {
              id: "before",
              type: "text",
              content: `### Before

❌ 8+ second load times
❌ 35% bounce rate
❌ Manual reporting (20h/week)
❌ No real-time analytics
❌ Poor mobile experience
❌ High customer churn`,
            },
          ],
          [
            {
              id: "after",
              type: "text",
              content: `### After

✅ 1.2 second load times
✅ 12% bounce rate
✅ Automated reporting (30min/week)
✅ Real-time dashboards
✅ Mobile-first design
✅ 40% more returning customers`,
            },
          ],
        ],
      },
      {
        id: "video-testimonial",
        type: "1-column",
        columns: [
          [
            {
              id: "video",
              type: "video",
              url: "https://www.w3schools.com/html/mov_bbb.mp4",
              title: "Customer Testimonial - AcmeCorp",
              description: "Hear directly from the AcmeCorp team about their experience",
              thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
            },
          ],
        ],
      },
      {
        id: "quote-cto",
        type: "1-column",
        columns: [
          [
            {
              id: "cto-quote",
              type: "quote",
              content: "The technical implementation was flawless. They understood our constraints and delivered ahead of schedule. Our engineering team loves the platform.",
              author: "Lisa Rodriguez",
              role: "CTO, AcmeCorp",
            },
          ],
        ],
      },
      {
        id: "key-takeaways",
        type: "1-column",
        columns: [
          [
            {
              id: "takeaways",
              type: "text",
              content: `## Key Takeaways

### For Similar Companies

If you're facing similar challenges, here's what we learned:

1. **Don't wait too long** - Technical debt compounds
2. **Performance matters** - Every second of load time affects revenue
3. **Data-driven decisions win** - Real-time analytics are essential
4. **Automation saves time** - Let technology handle repetitive tasks
5. **User experience is everything** - Happy customers spend more

### Next Steps for AcmeCorp

We're continuing to work with AcmeCorp on:
- International expansion
- Advanced personalization features
- AI-powered product recommendations
- Mobile app development`,
            },
          ],
        ],
      },
      {
        id: "full-report",
        type: "1-column",
        columns: [
          [
            {
              id: "pdf",
              type: "pdf",
              url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
              title: "Complete Case Study Report",
              description: "Download the full 25-page report with detailed metrics, timelines, and technical implementation details",
              displayMode: "both",
            },
          ],
        ],
      },
      {
        id: "cta",
        type: "1-column",
        columns: [
          [
            {
              id: "cta-text",
              type: "text",
              content: `## Ready to Achieve Similar Results?

Let's discuss how we can help your business grow.

[Schedule a Free Consultation →](#) · [View More Case Studies →](#)`,
            },
          ],
        ],
      },
    ],
  },
};
