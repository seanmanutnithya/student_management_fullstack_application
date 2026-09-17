import { useStaggerReveal } from "@/animation/reveal";
import Heatmap from "./Heatmap";
import ReasonChart from "./ReasonChart";
import WatchList from "./WatchList";

const InsightsPanel = ({ activeTab }) => {
  const isActive = activeTab === "insights";

  useStaggerReveal(".watch-row", [isActive], {
    y: 8,
    duration: 0.35,
    stagger: 0.04,
  });

  return (
    <section
      className={`attendance-panel${isActive ? " is-active" : ""}`}
      id="panel-insights"
      role="tabpanel"
      aria-labelledby="tab-insights">
      <div className="insights-grid">
        <Heatmap />
        <ReasonChart activeTab={activeTab} />
      </div>
      <WatchList />
    </section>
  );
};

export default InsightsPanel;
