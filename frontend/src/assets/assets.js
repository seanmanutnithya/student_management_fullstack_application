import {
  GraduationCap,
  Users,
  ClipboardCheck,
  Wallet,
  UserPlus,
  Megaphone,
  UserCheck,
  CircleDollarSign,
  BellRing,
} from "lucide-react";
const events = [
  {
    day: "18",
    month: "Aug",
    title: "Mid-term Exams begin",
    meta: "All classes",
  },
  {
    day: "22",
    month: "Aug",
    title: "Parent-Teacher Meeting",
    meta: "3:00 PM · Main hall",
  },
  { day: "29", month: "Aug", title: "Sports Day", meta: "Full day event" },
  {
    day: "02",
    month: "Sep",
    title: "Term 3 fees due",
    meta: "All students",
  },
];
const stats = [
  {
    icon: GraduationCap,
    colorClass: "purple",
    value: 1248,
    label: "Total students",
    trend: "4.2%",
    trendDirection: "up",
  },
  {
    icon: Users,
    colorClass: "blue",
    value: 86,
    label: "Total teachers",
    trend: "1.8%",
    trendDirection: "up",
  },
  {
    icon: ClipboardCheck,
    colorClass: "green",
    value: 94,
    suffix: "%",
    label: "Today's attendance",
    trend: "1.1%",
    trendDirection: "down",
  },
  {
    icon: Wallet,
    colorClass: "amber",
    value: 12400,
    prefix: "$",
    label: "Pending fees",
    trend: "6.4%",
    trendDirection: "down",
  },
];
const activities = [
  {
    type: "student",
    icon: UserPlus,
    text: `<strong>Eleanor Pena</strong> was admitted to Class 01`,
    time: "10 minutes ago",
  },
  {
    type: "fee",
    icon: Wallet,
    text: "<strong>Robert Rose</strong> paid Term 2 tuition — $420.00",
    time: "42 minutes ago",
  },
  {
    type: "notice",
    icon: Megaphone,
    text: 'Notice <strong>"Sports Day Schedule"</strong> was published',
    time: "1 hour ago",
  },
  {
    type: "attendance",
    icon: ClipboardCheck,
    text: "Attendance submitted for <strong>Class 03</strong>",
    time: "2 hours ago",
  },
  {
    type: "student",
    icon: UserCheck,
    text: "<strong>Guy Hawkins</strong>' profile was updated",
    time: "3 hours ago",
  },
  {
    type: "fee",
    icon: CircleDollarSign,
    text: "Fee reminder sent to <strong>4 guardians</strong>",
    time: "5 hours ago",
  },
  {
    type: "notice",
    icon: BellRing,
    text: 'Notice <strong>"Term 3 Fee Due Date"</strong> was published',
    time: "Yesterday",
  },
];

const absentees = [
  {
    name: "Marcus Lee",
    meta: "Class 04 · 5 days absent",
    avatar: 18,
    tag: "5",
    tagType: "danger",
  },
  {
    name: "Guy Hawkins",
    meta: "Class 02 · 4 days absent",
    avatar: 12,
    tag: "4",
    tagType: "danger",
  },
  {
    name: "Aiden Brooks",
    meta: "Class 03 · 3 days absent",
    avatar: 60,
    tag: "3",
    tagType: "warning",
  },
];
const defaulters = [
  {
    name: "Jane Cooper",
    meta: "Term 3 tuition",
    avatar: 25,
    tag: "$420",
    tagType: "danger",
  },
  {
    name: "Floyd Miles",
    meta: "Transport fee",
    avatar: 51,
    tag: "$95",
    tagType: "warning",
  },
  {
    name: "Priya Shah",
    meta: "Library fee",
    avatar: 47,
    tag: "$40",
    tagType: "warning",
  },
];
const birthdays = [
  {
    name: "Eleanor Pena",
    meta: "Class 01 · Aug 14",
    avatar: 5,
    tag: "in 2d",
    tagType: "primary",
  },
  {
    name: "Jenny Wilson",
    meta: "Class 01 · Aug 19",
    avatar: 32,
    tag: "in 7d",
    tagType: "primary",
  },
  {
    name: "Jacob Jones",
    meta: "Class 04 · Aug 27",
    avatar: 15,
    tag: "in 15d",
    tagType: "primary",
  },
];

export { stats, events, activities };
