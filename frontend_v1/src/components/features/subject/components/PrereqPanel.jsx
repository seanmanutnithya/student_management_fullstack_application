import { ArrowRight, CircleCheck, GitBranch, Link2Off, RefreshCw } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { useSubjects } from "@/context/SubjectContext";

/* A chain of nodes rather than a dropdown: a missing link shows up as a
   dashed node and a loop shows up as a returning arrow, so neither can hide
   the way it would in a list of ids. */
const PrereqPanel = ({ activeTab }) => {
  const { selected, chain, selectedCycle, brokenLinks, subjects, cycles } =
    useSubjects();
  const isActive = activeTab === "prereq";

  useStaggerReveal(".prereq-node", [isActive, selected?.id], {
    y: 8,
    duration: 0.32,
    stagger: 0.07,
  });

  if (!selected) return null;

  const byId = Object.fromEntries(subjects.map((s) => [s.id, s]));

  return (
    <div
      className={`subject-panel${isActive ? " is-active" : ""}`}
      id="panel-prereq"
      role="tabpanel"
      aria-labelledby="tab-prereq">
      <section className="detail-block">
        <header className="detail-block-head">
          <h3>
            <GitBranch />
            Prerequisite chain
          </h3>
          <span className="cell-sub">
            {chain.length} subject{chain.length === 1 ? "" : "s"} on this line
          </span>
        </header>

        <div className="prereq-chain" role="list">
          {chain.map((node, index) => (
            <div className="prereq-step" key={node.id ?? index} role="listitem">
              <div
                className={`prereq-node${
                  node.id === selected.id ? " is-current" : ""
                }${node.missing ? " is-missing" : ""}`}>
                {node.missing ?
                  <>
                    <span className="prereq-code">
                      <Link2Off />
                      {node.id}
                    </span>
                    <span className="prereq-name">Not in this catalogue</span>
                  </>
                : <>
                    <span className="prereq-code">{node.code}</span>
                    <span className="prereq-name">{node.name}</span>
                    <span className="cell-sub">{node.credits} credits</span>
                  </>
                }
              </div>
              {index < chain.length - 1 && (
                <ArrowRight className="prereq-arrow" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

        <div className="prereq-findings">
          {selectedCycle ?
            <p className="prereq-alert prereq-alert--error">
              <RefreshCw />
              <span>
                <strong>Circular prerequisite.</strong>{" "}
                {selectedCycle
                  .map((id) => byId[id]?.code ?? id)
                  .join(" → ")}{" "}
                — neither subject can ever be taken first. Break one of these
                links before publishing the catalogue.
              </span>
            </p>
          : null}

          {brokenLinks.length > 0 ?
            <p className="prereq-alert prereq-alert--warn">
              <Link2Off />
              <span>
                <strong>Broken link.</strong> {selected.code} requires{" "}
                {brokenLinks.join(", ")}, which is not offered this term.
                Students have no way to satisfy it.
              </span>
            </p>
          : null}

          {!selectedCycle && brokenLinks.length === 0 && (
            <p className="prereq-alert prereq-alert--ok">
              <CircleCheck />
              <span>
                This chain is sound — every prerequisite exists and nothing
                loops back on itself.
              </span>
            </p>
          )}

          {cycles.length > 0 && !selectedCycle && (
            <p className="cell-sub">
              {cycles.length} circular chain{cycles.length === 1 ? "" : "s"}{" "}
              elsewhere in the catalogue.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default PrereqPanel;
