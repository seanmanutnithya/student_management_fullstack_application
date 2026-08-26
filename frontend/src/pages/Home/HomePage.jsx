import "./HomePage.css";

import TopBar from "../../components/TopBar";
import GreetingBar from "../../components/GreetingBar";
import StatCard from "../../components/StatCard";
import QuickListCard from "../../components/QuickListCard";
import ActivityFeed from "../../components/ActivityFeed";
import EventLists from "../../components/EventsList";
import Charts from "../../components/Charts/Charts";

import { stats } from "../../assets/assets";

const HomePage = () => {
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
    </>
  );
};

export default HomePage;
