import { ChevronRight, Plus } from "lucide-react";

const PageHead = () => {
  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">Students List</h1>
        <p className="breadcrumb">
          <span>Home</span>
          <ChevronRight />
          <span className="is-current">Students</span>
        </p>
      </div>
      <button className="btn btn-primary" id="addStudentBtn">
        <Plus />
        <span>Add Students</span>
      </button>
    </div>
  );
};

export default PageHead;
