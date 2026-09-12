import {
  ArrowLeft,
  Award,
  BookMarked,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import StatCard from "@/components/cards/StatCard";
import CardTabs from "@/components/features/teacherDetail/components/CardTabs";
import TeacherProfileHeader from "@/components/features/teacherDetail/components/TeacherProfileHeader";
import { teacherSchedule } from "@/assets/data/teacherTabAssets";
import { useTeachers } from "@/context/TeacherContext";

const TeacherDetail = () => {
  const { openTeacher } = useTeachers();

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.fromTo(
      ".page-head",
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35 },
    )
      .fromTo(
        "#profileHeader",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.15",
      )
      .fromTo(
        ".stat-card",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 },
        "-=0.2",
      )
      .fromTo(
        ".tab-card",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.15",
      );
  }, []);

  if (!openTeacher) return null;

  const stats = [
    {
      icon: Award,
      colorClass: "purple",
      value: openTeacher.exp || "—",
      label: "Experience",
    },
    {
      icon: CalendarClock,
      colorClass: "amber",
      value: `${teacherSchedule.length} / week`,
      label: "Classes",
    },
    {
      icon: BookMarked,
      colorClass: "blue",
      value: openTeacher.dept || "—",
      label: "Department",
    },
    {
      icon: CheckCircle2,
      colorClass: "green",
      value: openTeacher.type || "—",
      label: "Employment",
    },
  ];

  return (
    <main className="main">
      <div className="page">
        <div className="page-head">
          <div>
            <h1 className="page-title">Teacher Details</h1>
            <p className="breadcrumb">
              <Link to="/">Home</Link>
              <ChevronRight />
              <Link to="/allteachers">Teachers</Link>
              <ChevronRight />
              <span className="is-current">{openTeacher.name}</span>
            </p>
          </div>
          <div className="page-head-actions">
            <Link className="btn btn-secondary" id="backBtn" to="/allteachers">
              <ArrowLeft />
              <span>Back to list</span>
            </Link>
          </div>
        </div>

        <TeacherProfileHeader />

        <section className="stat-grid">
          {stats.map((s) => (
            <StatCard
              key={s.label}
              Icon={s.icon}
              colorClass={s.colorClass}
              value={s.value}
              label={s.label}
            />
          ))}
        </section>

        <CardTabs />
      </div>
    </main>
  );
};

export default TeacherDetail;
