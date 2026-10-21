/* content.js — the facts about you that appear in more than one place.
   Your name, email, links and the menu. Section-specific copy lives at the top of that section's file. */

const linkedinUrl = "https://www.linkedin.com/in/towker-ahmmed-joy/";
const githubUrl = "https://github.com/shopifydevjoy";

export const profile = {
  name: "Towker Ahmmed Joy",
  short: "joy.dev",
  email: "towkerahmmed2003@gmail.com",
  phone: "01569191381",
  whatsappHref: "https://wa.me/8801569191381",
  linkedin: linkedinUrl,
  github: githubUrl,
  location: "Dhaka, BD",
  timeZone: "Asia/Dhaka",
  status: "Currently working at Maktech",
  statusUrl: "https://www.maktechgroup.com",
  resume: "/resume.pdf",
  bio: "Shopify developer building custom themes, sections and apps that stay fast.",
  role: "SHOPIFY & WORDPRESS DEVELOPER — DHAKA, BD",
  working: "Team lead @ Maktech",
  tagline: "Helping merchants launch faster...",
  quote: "Build it so the next developer thanks you.",
  socials: [
    { label: "LinkedIn", icon: "linkedin", href: linkedinUrl },
    { label: "GitHub", icon: "github", href: githubUrl },
    { label: "Email", icon: "mail", href: "mailto:towkerahmmed2003@gmail.com" }
  ]
};

export const nav = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" }
];
