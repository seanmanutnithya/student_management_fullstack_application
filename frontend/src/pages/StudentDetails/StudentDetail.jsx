import { Link } from "react-router-dom";
import "./StudentDetail.css";
import { ChevronRight, ArrowLeft } from "lucide-react";
import ProfileHeader from "@/components/features/studentDetail/components/ProfileHeader";
import { studentDetailStat } from "@/assets/data/stats";
import StatCard from "@/components/cards/StatCard";
import CardTabs from "@/components/features/studentDetail/components/CardTabs";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
const StudentDetail = () => {
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.fromTo(
      ".topbar, .mobile-topbar",
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.3 },
      "-=0.2",
    )
      .fromTo(
        ".page-head",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35 },
        "-=0.1",
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
  return (
    <main className="main">
      <div className="page">
        <div className="page-head">
          <div>
            <h1 className="page-title">Student Details</h1>
            <p className="breadcrumb">
              <Link to={"/"}>Home</Link>
              <ChevronRight />
              <Link to={"/allstudents"}>Students</Link>
              <ChevronRight />
              <span className="is-current">Jessia Rose</span>
            </p>
          </div>
          <div className="page-head-actions">
            <button className="btn btn-secondary" id="backBtn">
              <ArrowLeft />
              <Link to={"/allstudents"}>Back to list</Link>
            </button>
          </div>
        </div>

        {/* <!-- ============ Profile header ============ --> */}
        <ProfileHeader />

        {/* <!-- ============ Stat cards ============ --> */}
        <section className="stat-grid">
          {studentDetailStat.map((s, idx) => (
            <StatCard
              key={idx}
              Icon={s.icon}
              colorClass={s.colorClass}
              value={s.value}
              label={s.label}
              ring={s.ring}
            />
          ))}
        </section>
        {/* <!-- ============ Tabs ============ --> */}
        <CardTabs />
      </div>
    </main>
  );
};

export default StudentDetail;
