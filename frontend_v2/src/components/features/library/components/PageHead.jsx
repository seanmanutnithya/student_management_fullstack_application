import { BookUp, ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui";
import { useLibrary } from "@/context/LibraryContext";

const PageHead = () => {
  const { openIssueModal, openAddBook } = useLibrary();

  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">Library</h1>
        <p className="breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight />
          <span className="is-current">Library</span>
        </p>
      </div>
      <div className="page-head-actions">
        <Button
          variant="secondary"
          icon={Plus}
          id="addBookBtn"
          onClick={openAddBook}>
          Add Book
        </Button>
        <Button
          icon={BookUp}
          id="issueBookBtn"
          onClick={() => openIssueModal("", "borrow")}>
          Issue Book
        </Button>
      </div>
    </div>
  );
};

export default PageHead;
