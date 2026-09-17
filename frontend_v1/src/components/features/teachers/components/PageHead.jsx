import { ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui";
import { useTeachers } from "@/context/TeacherContext";

const PageHead = () => {
  const { openAddTeacher } = useTeachers();

  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">Teachers</h1>
        <p className="breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight />
          <span className="is-current">Teachers</span>
        </p>
      </div>
      <Button icon={Plus} id="addTeacherBtn" onClick={openAddTeacher}>
        Add Teacher
      </Button>
    </div>
  );
};

export default PageHead;
