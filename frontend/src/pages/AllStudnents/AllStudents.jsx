import PageHead from "@/components/features/students/components/PageHead";
import "../../index.css";
import Table from "@/components/features/students/components/Table";
import TopBar from "@/components/layout/TopBar";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import CardHead from "@/components/features/students/components/CardHead";

const AllStudents = () => {
  return (
    <main className="main">
      <TopBar />
      <div className="page">
        <PageHead />
        <section className="card">
          <CardHead />
          {/* <!-- Table (desktop / tablet) --> */}
          <Table />
          {/* <!-- Card list (mobile) --> */}
          {/* <StudentCards /> */}

          <div className="card-foot">
            <span className="results-note">
              Showing <strong>1–10</strong> of
              <strong>1,000</strong> students
            </span>
            <nav className="pagination" id="pagination" aria-label="Pagination">
              <button className="page-btn" aria-label="Previous page">
                <ChevronLeft />
              </button>
              <button className="page-btn is-active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">4</button>
              <button className="page-btn">5</button>
              <span className="page-ellipsis">···</span>
              <button className="page-btn">100</button>
              <button className="page-btn" aria-label="Next page">
                <ChevronRight />
              </button>
              <button
                className="select-field select-field--sm"
                id="pageSizeBtn">
                <span>10 / page</span>
                <ChevronDown />
              </button>
            </nav>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AllStudents;
