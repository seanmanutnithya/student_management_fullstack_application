import { CircleCheck, Send, TriangleAlert, Users } from "lucide-react";

import { publishAudience } from "@/assets/data/examSeed";
import { Button, Modal } from "@/components/ui";
import { useExams } from "@/context/ExamContext";

/* Two-stage publish: the confirmation spells out exactly who gains access,
   and what is still incomplete, before anything leaves draft. */
const PublishModal = () => {
  const {
    publishOpen,
    setPublishOpen,
    publish,
    publishing,
    publishReadiness,
    session,
    rows,
    students,
  } = useExams();

  const counts = {
    students: rows.filter((r) => r.weighted !== null).length,
    guardians: rows.filter((r) => r.weighted !== null).length,
    teachers: new Set(students.map((s) => s.classId)).size,
  };

  return (
    <Modal
      open={publishOpen}
      onClose={() => setPublishOpen(false)}
      title="Publish results"
      titleId="publishTitle"
      footer={
        <>
          <Button variant="secondary" onClick={() => setPublishOpen(false)}>
            Keep as draft
          </Button>
          <Button icon={Send} loading={publishing} onClick={publish}>
            Publish {session.name}
          </Button>
        </>
      }>
      <div className="publish-body">
        <p className="publish-intro">
          Publishing moves <strong>{session.name}</strong> out of draft. Until
          now only staff could see these marks.
        </p>

        <ul className="publish-audience">
          {publishAudience.map((entry) => (
            <li key={entry.key}>
              <span className="publish-icon">
                <Users />
              </span>
              <span className="publish-meta">
                <strong>
                  {entry.label}
                  <span className="publish-count">{counts[entry.key]}</span>
                </strong>
                <span className="cell-sub">{entry.note}</span>
              </span>
            </li>
          ))}
        </ul>

        {publishReadiness.ok ?
          <p className="publish-note is-ok">
            <CircleCheck />
            Every student is fully marked and the paper schedule is clear.
          </p>
        : <p className="publish-note is-warn">
            <TriangleAlert />
            {publishReadiness.missing.length > 0 && (
              <span>
                {publishReadiness.missing.length} student(s) are missing marks —
                their report cards will show gaps.
              </span>
            )}
            {publishReadiness.conflictCount > 0 && (
              <span>
                {publishReadiness.conflictCount} paper clash(es) are still
                unresolved in the planner.
              </span>
            )}
          </p>
        }
      </div>
    </Modal>
  );
};

export default PublishModal;
