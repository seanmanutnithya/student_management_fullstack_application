import "./HomePage.css";

import TopBar from "../../components/TopBar";
import GreetingBar from "../../components/GreetingBar";
import StatCard from "../../components/StatCard/StatCard";
import QuickListCard from "../../components/QuickListCard";
import ActivityFeed from "../../components/ActivityFeed/ActivityFeed";
import EventLists from "../../components/EventsList";
import Charts from "../../components/Charts/Charts";
import Toast from "../../components/Toast";

import { showToast } from "../../hooks/useToast";
import { stats } from "../../assets/assets";

import { wireHoverScale } from "../../animation/wireHoverScale";

import { useEffect, useState } from "react";

const HomePage = () => {
  useEffect(() => {
    wireHoverScale(".icon-btn", 1.08);
  }, []);

  return (
    <>
      <div className="sidebar-overlay " id="sidebarOverlay"></div>

      <main className="main">
        {/* top bar */}
        <TopBar />
        <div className="page">
          {/* <!-- ============ Greeting bar ============ --> */}
          <GreetingBar />
          {/* <!-- ============ Stat cards ============ --> */}
          <section className="stat-grid" id="statGrid">
            {stats.map((s, idx) => (
              <div key={idx}>
                <StatCard
                  Icon={s.icon}
                  colorClass={s.colorClass}
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  label={s.label}
                  trend={s.trend}
                  trendDirection={s.trendDirection}
                />
              </div>
            ))}
          </section>
          {/* <!-- ============ Main grid: charts/lists left, activity/events right ============ --> */}

          <div className="home-grid">
            <div className="home-col-main">
              {/* <!-- Charts --> */}
              <Charts />
              {/* <!-- Quick lists --> */}
              <QuickListCard />
            </div>

            <div className="home-col-side">
              {/* <!-- Recent activity --> */}
              <ActivityFeed />

              {/* <!-- Upcoming events --> */}
              <EventLists />
            </div>
          </div>
        </div>
      </main>

      {/* <!-- Create Notice modal --> */}

      {/* <!-- Toast --> */}
      <Toast />
    </>
  );
};

export default HomePage;
