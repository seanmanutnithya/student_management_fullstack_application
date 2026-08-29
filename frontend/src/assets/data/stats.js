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

export { stats, events, activities };
