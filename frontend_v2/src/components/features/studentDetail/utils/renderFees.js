import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

// Placeholder until the API serves a student's invoices.
export const FEES = [
  {
    invoice: "#INV-1042",
    desc: "Term 2 tuition fee",
    date: "02 Jun 2026",
    amount: "$420.00",
    status: "paid",
  },
  {
    invoice: "#INV-1039",
    desc: "Library & lab fee",
    date: "15 May 2026",
    amount: "$60.00",
    status: "paid",
  },
  {
    invoice: "#INV-1045",
    desc: "Term 3 tuition fee",
    date: "01 Sep 2026",
    amount: "$420.00",
    status: "due",
  },
  {
    invoice: "#INV-1030",
    desc: "Transport fee — Q2",
    date: "10 Apr 2026",
    amount: "$95.00",
    status: "pending",
  },
];

// The class suffix (fee-status--paid) is the key itself.
export const FEE_STATUS = {
  paid: { icon: CheckCircle2, label: "Paid" },
  due: { icon: AlertCircle, label: "Due" },
  pending: { icon: Clock, label: "Pending" },
};
