import { useEffect } from "react";
import { RotateCcw, Save, Scale, TriangleAlert } from "lucide-react";

import { animateWeightBands } from "@/animation/subjectPageAnimation";
import { shake } from "@/animation/shake";
import { Button } from "@/components/ui";
import { useSubjects } from "@/context/SubjectContext";

const PARTS = [
  { key: "assignment", label: "Assignment", hint: "Coursework and classwork" },
  { key: "midterm", label: "Midterm", hint: "Mid-semester examination" },
  { key: "final", label: "Final", hint: "End-of-year examination" },
];

const PRESETS = [
  { label: "30 / 30 / 40", weights: { assignment: 30, midterm: 30, final: 40 } },
  { label: "40 / 20 / 40", weights: { assignment: 40, midterm: 20, final: 40 } },
  { label: "50 / 20 / 30", weights: { assignment: 50, midterm: 20, final: 30 } },
];

const GradingPanel = ({ activeTab }) => {
  const {
    selected,
    draft,
    gradingTotal,
    gradingValid,
    gradingDirty,
    savingGrading,
    gradingFormRef,
    setWeight,
    resetGrading,
    saveGrading,
  } = useSubjects();

  const isActive = activeTab === "grading";

  // Bands settle into their share whenever a weight moves.
  useEffect(() => {
    if (isActive) animateWeightBands();
  }, [isActive, draft, selected?.id]);

  if (!selected || !draft) return null;

  const remaining = 100 - gradingTotal;

  const handleSave = () => {
    if (!gradingValid) {
      shake(gradingFormRef.current);
      return;
    }
    saveGrading();
  };

  return (
    <div
      className={`subject-panel${isActive ? " is-active" : ""}`}
      id="panel-grading"
      role="tabpanel"
      aria-labelledby="tab-grading">
      <section className="detail-block">
        <header className="detail-block-head">
          <h3>
            <Scale />
            Grading scheme
          </h3>
          <div className="preset-row">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="preset-chip"
                onClick={() => {
                  Object.entries(preset.weights).forEach(([part, value]) =>
                    setWeight(part, value),
                  );
                }}>
                {preset.label}
              </button>
            ))}
          </div>
        </header>

        <form
          className="grading-form"
          ref={gradingFormRef}
          onSubmit={(e) => e.preventDefault()}>
          {/* The allocator: one band per component, widths are the weights. */}
          <div className="weight-bar" aria-hidden="true">
            {PARTS.map((part) => (
              <span
                key={part.key}
                className={`weight-band weight-band--${part.key}`}
                data-share={draft[part.key]}
                style={{ width: `${draft[part.key]}%` }}
              />
            ))}
            {remaining > 0 && (
              <span
                className="weight-band weight-band--empty"
                data-share={remaining}
                style={{ width: `${remaining}%` }}
              />
            )}
          </div>

          <div className="weight-rows">
            {PARTS.map((part) => (
              <div className="weight-row" key={part.key}>
                <label htmlFor={`weight-${part.key}`}>
                  <span className={`weight-dot weight-band--${part.key}`} />
                  {part.label}
                  <span className="cell-sub">{part.hint}</span>
                </label>
                <input
                  id={`weight-${part.key}`}
                  className="weight-slider"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={draft[part.key]}
                  onChange={(e) => setWeight(part.key, e.target.value)}
                />
                <div className="weight-number">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    aria-label={`${part.label} weight`}
                    value={draft[part.key]}
                    onChange={(e) => setWeight(part.key, e.target.value)}
                  />
                  <span>%</span>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`weight-total${gradingValid ? " is-valid" : " is-invalid"}`}
            role="status">
            <span>Total weight</span>
            <strong>{gradingTotal}%</strong>
            {gradingValid ?
              <span className="weight-total-note">Ready to save</span>
            : <span className="weight-total-note">
                <TriangleAlert />
                {remaining > 0 ?
                  `${remaining}% still to allocate`
                : `${Math.abs(remaining)}% over — trim a component`}
              </span>
            }
          </div>

          {!gradingValid && (
            <p className="field-error grading-error">
              A scheme must total exactly 100% before it can be saved.
            </p>
          )}

          <div className="detail-foot">
            <Button
              variant="secondary"
              icon={RotateCcw}
              onClick={resetGrading}
              disabled={!gradingDirty || savingGrading}>
              Discard
            </Button>
            {/* Stays clickable while the total is wrong so the press can
                shake and explain, rather than dying silently. */}
            <Button
              icon={Save}
              loading={savingGrading}
              disabled={!gradingDirty}
              onClick={handleSave}>
              Save scheme
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default GradingPanel;
