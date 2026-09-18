import "../../styles/index.css";
import PageHead from "@/components/features/students/components/PageHead";
import Table from "@/components/features/students/components/Table";
import StudentCards from "@/components/features/students/components/StudentCards";
import TopBar from "@/components/layout/TopBar";
import CardHead from "@/components/features/students/components/CardHead";
import ConfirmDialog from "@/components/features/students/components/ConfirmDialog";
import StudentFormModal from "@/components/features/students/components/StudentFormModal";
import { Pagination } from "@/components/ui";
import { useStudent } from "@/context/StudentContext";
import { ChevronDown } from "lucide-react";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { wireHoverScale } from "../../animation/hover";
import StudentDetail from "../StudentDetails/StudentDetail";
import { Modal } from "@/components/ui";
import { useNavigate, useParams } from "react-router-dom";

const AllStudents = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    detailOpen,
    openDetail,
    closeDetail,
    students,
    pagedStudents,
    page,
    pageCount,
    pageStart,
    pageEnd,
    setPage,
    pageSize,
    resultCount,
  } = useStudent();

  /* `openDetail` looks the student up in `students`, which is empty until the
     fetch resolves. On a fresh load of /allstudents/:id that lookup misses, so
     this has to re-run when the list arrives — keyed on `id` alone it never did,
     and the detail modal opened with no student behind it. */
  useEffect(() => {
    if (id) {
      openDetail(id);
    } else {
      closeDetail();
    }
  }, [id, students]);
  // Page chrome is in the DOM from the first paint, so this runs once on mount.
  useGSAP(
    () => {
      gsap
        .timeline({ defaults: { ease: "power1.out" } })
        .fromTo(
          ".topbar, .mobile-topbar",
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.3 },
        )
        .fromTo(
          ".card",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
          "-=0.1",
        );

      wireHoverScale(".btn", 1.035);
      wireHoverScale(".icon-btn", 1.08);
      wireHoverScale(".page-btn", 1.08);
    },
    { scope: containerRef },
  );

  /* Rows only exist once the fetch resolves, so they cannot be animated from
     the mount timeline above — that is what warned "target .table-row not
     found". Keying on a boolean rather than the list itself means the entrance
     plays when rows first appear, and filtering down to a smaller (still
     non-empty) result does not restart it mid-keystroke. */
  const hasRows = pagedStudents.length > 0;

  useGSAP(
    () => {
      if (!hasRows) return;
      gsap.fromTo(
        ".table-row",
        { opacity: 0, x: -8 },
        {
          opacity: 1,
          x: 0,
          duration: 0.25,
          stagger: 0.03,
          ease: "power1.out",
        },
      );
      wireHoverScale(".row-action-btn", 1.12);
      wireHoverScale(".page-btn", 1.08);
    },
    { dependencies: [hasRows, page], scope: containerRef },
  );
  return (
    <>
      <main className="main" ref={containerRef}>
        <TopBar />
        <ConfirmDialog />
        <StudentFormModal />
        <div className="page">
          <PageHead />
          <section className="card">
            <CardHead />
            {/* <!-- Table (desktop / tablet) --> */}
            <Table />
            {/* <!-- Card list (mobile) --> */}
            <StudentCards />

            <div className="card-foot">
              <span className="results-note">
                Showing{" "}
                <strong>
                  {pageStart}–{pageEnd}
                </strong>{" "}
                of <strong>{resultCount}</strong> students
              </span>
              <nav
                className="pagination"
                id="pagination"
                aria-label="Pagination">
                <Pagination
                  page={page}
                  pageCount={pageCount}
                  onPageChange={setPage}
                />
                <button
                  className="select-field select-field--sm"
                  id="pageSizeBtn">
                  <span>{pageSize} / page</span>
                  <ChevronDown />
                </button>
              </nav>
            </div>
          </section>
        </div>
      </main>
      {detailOpen && (
        <Modal
          open={detailOpen}
          onClose={() => navigate("/allstudents")}
          size="lg">
          <StudentDetail />
        </Modal>
      )}
    </>
  );
};

export default AllStudents;
