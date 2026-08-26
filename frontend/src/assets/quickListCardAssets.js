import { UserX, CircleDollarSign, Cake } from "lucide-react";
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
const sections = [
  {
    icon: UserX,
    title: "Top absentees this week",
    data: absentees,
    id: "absenteesList",
  },
  {
    icon: CircleDollarSign,
    title: "Fee defaulters",
    data: defaulters,
    id: "defaultersList",
  },
  {
    icon: Cake,
    title: "Birthdays this month",
    data: birthdays,
    id: "birthdaysList",
  },
];

export { absentees, defaulters, birthdays, sections };
