import {
  Bell,
  ClipboardCheck,
  Megaphone,
  Monitor,
  Smartphone,
  Tablet,
  UserPlus,
  Wallet,
} from "lucide-react";

/* ============================================================
   ACCOUNT SEED DATA — UI only, no backend.
   ============================================================ */

export const accountTabButtons = [
  { id: "tab-profile", control: "panel-profile", tab: "profile", label: "Profile" },
  {
    id: "tab-security",
    control: "panel-security",
    tab: "security",
    label: "Security",
  },
  {
    id: "tab-notifications",
    control: "panel-notifications",
    tab: "notifications",
    label: "Notifications",
  },
  {
    id: "tab-preferences",
    control: "panel-preferences",
    tab: "preferences",
    label: "Preferences",
  },
];

export const seedProfile = {
  name: "Priscilla Lily",
  email: "priscilla.lily@iaacademy.edu",
  phone: "+855 12 345 678",
  role: "Admin",
  employeeId: "EMP-0041",
  avatar: "https://i.pravatar.cc/160?img=47",
  joinedOn: "2021-08-16",
};

/* Each row gets an Email and an In-app toggle. */
export const notificationEvents = [
  {
    key: "enrolled",
    icon: UserPlus,
    label: "New student enrolled",
    hint: "When an admission is completed",
    email: true,
    inApp: true,
  },
  {
    key: "payment",
    icon: Wallet,
    label: "Fee payment received",
    hint: "Every confirmed payment",
    email: true,
    inApp: true,
  },
  {
    key: "attendance",
    icon: ClipboardCheck,
    label: "Attendance submitted",
    hint: "Once a class register is filed",
    email: false,
    inApp: true,
  },
  {
    key: "notice",
    icon: Megaphone,
    label: "Notice published",
    hint: "School-wide announcements",
    email: true,
    inApp: false,
  },
  {
    key: "overdue",
    icon: Bell,
    label: "Overdue fees",
    hint: "Daily digest of unpaid balances",
    email: true,
    inApp: true,
  },
];

export const seedSessions = [
  {
    id: "SES-01",
    icon: Monitor,
    browser: "Chrome 128",
    os: "Windows 11",
    location: "Phnom Penh, KH",
    lastActive: "Active now",
    current: true,
  },
  {
    id: "SES-02",
    icon: Tablet,
    browser: "Safari 17",
    os: "iPadOS 17",
    location: "Phnom Penh, KH",
    lastActive: "2 hours ago",
    current: false,
  },
  {
    id: "SES-03",
    icon: Smartphone,
    browser: "Chrome 127",
    os: "Android 14",
    location: "Siem Reap, KH",
    lastActive: "Yesterday, 18:40",
    current: false,
  },
  {
    id: "SES-04",
    icon: Monitor,
    browser: "Firefox 129",
    os: "macOS 14",
    location: "Singapore, SG",
    lastActive: "3 days ago",
    current: false,
  },
];

export const languages = [
  { value: "en", label: "English" },
  { value: "km", label: "ខ្មែរ (Khmer)" },
  { value: "fr", label: "Français" },
  { value: "zh", label: "中文 (简体)" },
];

export const timezones = [
  { value: "Asia/Phnom_Penh", label: "Asia/Phnom Penh (GMT+7)" },
  { value: "Asia/Bangkok", label: "Asia/Bangkok (GMT+7)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (GMT+8)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (GMT+9)" },
  { value: "Europe/London", label: "Europe/London (GMT+0)" },
  { value: "America/New_York", label: "America/New York (GMT-5)" },
];

export const seedPreferences = {
  language: "en",
  timezone: "Asia/Phnom_Penh",
  theme: "system",
};

/* The demo OTP — shown as a hint in the modal so both the success and the
   failure path can be exercised without a backend. */
export const DEMO_OTP = "1234";

export const makeBackupCodes = () =>
  Array.from({ length: 6 }, () =>
    Math.random().toString(36).slice(2, 6).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase(),
  );
