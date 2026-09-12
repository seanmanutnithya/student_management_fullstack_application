import {
  BookOpen,
  BookCheck,
  BookUp,
  AlarmClock,
  CircleCheck,
  Clock3,
  TriangleAlert,
  BookMarked,
} from "lucide-react";

export const libraryTabButtons = [
  {
    id: "tab-catalog",
    control: "panel-catalog",
    tab: "catalog",
    label: "Catalog",
  },
  {
    id: "tab-borrowing",
    control: "panel-borrowing",
    tab: "borrowing",
    label: "Borrowing",
  },
  {
    id: "tab-members",
    control: "panel-members",
    tab: "members",
    label: "Members",
  },
];

// `key` reads the matching count off the summary derived in LibraryContext.
export const librarySummaryCards = [
  { key: "titles", icon: BookOpen, colorClass: "purple", label: "Total titles" },
  {
    key: "available",
    icon: BookCheck,
    colorClass: "green",
    label: "Copies available",
  },
  {
    key: "borrowed",
    icon: BookUp,
    colorClass: "blue",
    label: "Currently borrowed",
  },
  { key: "overdue", icon: AlarmClock, colorClass: "amber", label: "Overdue" },
];

export const availabilityOptions = [
  { value: "", label: "Any availability" },
  { value: "available", label: "Available" },
  { value: "checked-out", label: "Checked out" },
  { value: "reserved", label: "Reserved" },
];

export const recordFilterOptions = [
  { value: "", label: "All records" },
  { value: "borrowed", label: "Borrowed" },
  { value: "overdue", label: "Overdue" },
  { value: "returned", label: "Returned" },
];

// Shared pill meta for both copy availability and loan status.
export const statusMeta = {
  available: { label: "Available", icon: CircleCheck, tone: "green" },
  "checked-out": { label: "Checked out", icon: Clock3, tone: "muted" },
  reserved: { label: "Reserved", icon: BookMarked, tone: "purple" },
  borrowed: { label: "Borrowed", icon: Clock3, tone: "blue" },
  overdue: { label: "Overdue", icon: TriangleAlert, tone: "red" },
  returned: { label: "Returned", icon: CircleCheck, tone: "green" },
};
