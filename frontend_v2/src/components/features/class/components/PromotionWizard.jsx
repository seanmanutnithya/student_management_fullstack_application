import { memo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  GraduationCap,
  TriangleAlert,
} from "lucide-react";

import { shake } from "@/animation/shake";
import { promotionSteps } from "@/assets/data/classSeed";
import { Button, Field, Modal } from "@/components/ui";
import { useClasses } from "@/context/ClassContext";

/* Memoised per student so typing a retention note re-renders one row. */
const ReviewRow = memo(function ReviewRow({
  student,
  decision,
  note,
  showError,
  attendanceThreshold,
  gradeThreshold,
  onDecide,
  onNote,
}) {
  const retaining = decision === "retain";
  const noteInvalid = retaining && (note ?? "").trim().length < 5;

  return (
    <li className={`review-row${retaining ? " is-retained" : ""}`}>
      <img className="student-avatar" src={student.avatar} alt="" loading="lazy" />
      <span className="review-meta">
        <strong>{student.name}</strong>
        <span className="cell-sub">
          <span className={student.attendance < attendanceThreshold ? "is-low" : ""}>
            {student.attendance}% attendance
          </span>
          {" · "}
          <span className={student.grade < gradeThreshold ? "is-low" : ""}>
            {student.grade}% average
          </span>
        </span>
      </span>

      <span className="review-choice" role="radiogroup" aria-label={`Decision for ${student.name}`}>
        {["promote", "retain"].map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={decision === option}
            className={`review-chip review-chip--${option}${
              decision === option ? " is-active" : ""
            }`}
            onClick={() => onDecide(student.id, option)}>
            {option === "promote" ? "Promote" : "Retain"}
          </button>
        ))}
      </span>

      {retaining && (
        <Field
          className="review-note"
          error={showError && noteInvalid ? "Give a reason of at least 5 characters." : ""}>
          <input
            type="text"
            aria-label={`Reason for retaining ${student.name}`}
            placeholder="Reason shared with the guardian"
            value={note ?? ""}
            onChange={(e) => onNote(student.id, e.target.value)}
          />
        </Field>
      )}
    </li>
  );
});

const PromotionWizard = () => {
  const {
    wizardOpen,
    wizardStep,
    wizardClassId,
    setWizardClassId,
    wizardClass,
    rows,
    decisions,
    setDecision,
    retainNotes,
    setRetainNote,
    retained,
    promoted,
    missingNotes,
    wizardTouched,
    wizardFormRef,
    promoting,
    closeWizard,
    goNext,
    goBack,
    confirmPromotion,
    attendanceThreshold,
    gradeThreshold,
  } = useClasses();

  const isLast = wizardStep === 2;

  const handleNext = () => {
    if (!goNext()) shake(wizardFormRef.current);
  };

  return (
    <Modal
      open={wizardOpen}
      onClose={closeWizard}
      title="Year-end promotion"
      titleId="promotionTitle"
      size="lg"
      footer={
        <>
          {wizardStep > 0 && (
            <Button variant="secondary" icon={ArrowLeft} onClick={goBack}>
              Back
            </Button>
          )}
          <Button variant="secondary" onClick={closeWizard}>
            Cancel
          </Button>
          {isLast ?
            <Button
              icon={GraduationCap}
              loading={promoting}
              onClick={confirmPromotion}>
              Promote {promoted.length} student
              {promoted.length === 1 ? "" : "s"}
            </Button>
          : <Button icon={ArrowRight} onClick={handleNext}>
              Continue
            </Button>
          }
        </>
      }>
      <div ref={wizardFormRef}>
        <ol className="wizard-steps">
          {promotionSteps.map((step, index) => (
            <li
              key={step.key}
              className={`wizard-step${index === wizardStep ? " is-active" : ""}${
                index < wizardStep ? " is-done" : ""
              }`}>
              <span className="wizard-step-dot">
                {index < wizardStep ? <CircleCheck /> : index + 1}
              </span>
              {step.label}
            </li>
          ))}
        </ol>

        {wizardStep === 0 && (
          <div className="wizard-body">
            <p className="wizard-intro">
              Pick the section to close out. Its roster is archived intact, and
              promoted students leave the active register.
            </p>
            <Field
              label="Class"
              htmlFor="wizardClass"
              error={
                wizardTouched && !wizardClassId ?
                  "Choose the class you are promoting."
                : ""
              }>
              <select
                id="wizardClass"
                value={wizardClassId}
                onChange={(e) => setWizardClassId(e.target.value)}>
                <option value="">Select a section</option>
                {rows.map((klass) => (
                  <option key={klass.id} value={klass.id}>
                    {klass.id} — {klass.grade} · {klass.enrolled} students
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {wizardStep === 1 && wizardClass && (
          <div className="wizard-body">
            <p className="wizard-intro">
              Everyone under {attendanceThreshold}% attendance or{" "}
              {gradeThreshold}% average starts marked <strong>Retain</strong>.
              Override any row, and say why a student is being held back.
            </p>

            {wizardTouched && missingNotes.length > 0 && (
              <p className="wizard-warning">
                <TriangleAlert />
                {missingNotes.length} retained student
                {missingNotes.length === 1 ? "" : "s"} still need a reason.
              </p>
            )}

            <ul className="review-list">
              {wizardClass.students.map((student) => (
                <ReviewRow
                  key={student.id}
                  student={student}
                  decision={decisions[student.id]}
                  note={retainNotes[student.id]}
                  showError={wizardTouched}
                  attendanceThreshold={attendanceThreshold}
                  gradeThreshold={gradeThreshold}
                  onDecide={setDecision}
                  onNote={setRetainNote}
                />
              ))}
            </ul>
          </div>
        )}

        {wizardStep === 2 && wizardClass && (
          <div className="wizard-body">
            <div className="wizard-summary">
              <div className="wizard-figure wizard-figure--promote">
                <strong>{promoted.length}</strong>
                <span>Promoted out of {wizardClass.id}</span>
              </div>
              <div className="wizard-figure wizard-figure--retain">
                <strong>{retained.length}</strong>
                <span>Retained in {wizardClass.id}</span>
              </div>
            </div>

            {retained.length > 0 && (
              <div className="wizard-retained">
                <h4>Students being retained</h4>
                <ul>
                  {retained.map((student) => (
                    <li key={student.id}>
                      <strong>{student.name}</strong>
                      <span className="cell-sub">
                        {retainNotes[student.id]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="wizard-note">
              <TriangleAlert />
              {wizardClass.id} is archived as part of this step. It stays
              viewable as read-only history and can't be edited afterwards.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PromotionWizard;
