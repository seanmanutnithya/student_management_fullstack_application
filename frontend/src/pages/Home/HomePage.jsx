import "./HomePage.css";

import TopBar from "@/components/layout/TopBar";
import GreetingBar from "@/components/features/home/components/GreetingBar";
import StatCard from "@/components/cards/StatCard";
import QuickListCard from "@/components/features/home/components/QuickListCard";
import ActivityFeed from "@/components/features/home/components/ActivityFeed";
import EventLists from "@/components/features/home/components/EventsList";
import Charts from "@/components/features/home/components/Charts";
import Toast from "@/components/Toast";

import { stats } from "@/assets/data/stats";
import { wireHoverScale } from "@/animation/hover";

import { usePageLoadAnimation } from "@/animation/pageLoadAnimation";
import renderDonutChart from "@/components/features/home/utils/renderDonutChart";
import renderLineChart from "@/components/features/home/utils/renderLineChart";

const HomePage = () => {
  const containerRef = usePageLoadAnimation(() => {
    wireHoverScale(".btn", 1.035);
    wireHoverScale(".icon-btn", 1.08);
    wireHoverScale(".row-action-btn", 1.12);
    wireHoverScale(".page-btn", 1.08);

    renderDonutChart();
    renderLineChart();
  });
  return (
    <>
      <div className="sidebar-overlay " id="sidebarOverlay"></div>
      <main className="main" ref={containerRef}>
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
