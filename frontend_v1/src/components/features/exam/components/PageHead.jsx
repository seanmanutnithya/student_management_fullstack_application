import { ChevronRight, CircleCheck, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";

import { useExams } from "@/context/ExamContext";

const PageHead = () => {
  const { session } = useExams();
  const published = session.status === "published";

  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">Exams</h1>
        <p className="breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight />
          <span className="is-current">Exams</span>
        </p>
      </div>
      <p className="exam-head-meta">
        <span
          className={`status-pill ${
            published ? "status-pill--green" : "status-pill--amber"
          }`}>
          {published ? <CircleCheck /> : <TriangleAlert />}
          {published ? "Published" : "Draft"}
        </span>
        <span>
          {session.name} · {session.term}
        </span>
      </p>
    </div>
  );
};

export default PageHead;
