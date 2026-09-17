import React from "react";
import { overviews } from "@/assets/data/tabAssets";
const Overview = ({ activeTab }) => {
  if (activeTab !== "overview") return null;
  return (
    <div
      className="detail-panel is-active"
      id="panel-overview"
      role="tabpanel"
      aria-labelledby="tab-overview"
      data-panel="overview">
      <div className="info-grid">
        {overviews.map((overview) => {
          const Icon = overview.icon;
          return (
            <div className="info-block" key={overview.title}>
              <h3 className="info-block-title">
                <Icon />
                {overview.title}
              </h3>
              <dl className="info-list">
                {overview.items.map((o) => (
                  <div key={o.dt}>
                    <dt>{o.dt}</dt>
                    <dd>{o.dd}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Overview;
