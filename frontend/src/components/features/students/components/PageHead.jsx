import { ChevronRight, Plus } from "lucide-react";
import { useStudent } from "@/context/StudentContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui";
const PageHead = () => {
  const { openAddStudent } = useStudent();
  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">Students List</h1>
        <p className="breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight />
          <span className="is-current">Students</span>
        </p>
      </div>
      <Button icon={Plus} id="addStudentBtn" onClick={() => openAddStudent()}>
        Add Students
      </Button>
    </div>
  );
};

export default PageHead;
