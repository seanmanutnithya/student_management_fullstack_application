import "./AllTeachers.css";
import { useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import TopBar from "@/components/layout/TopBar";
import CardHead from "@/components/features/teachers/components/CardHead";
import ConfirmDialog from "@/components/features/teachers/components/ConfirmDialog";
import PageHead from "@/components/features/teachers/components/PageHead";
import SummaryStrip from "@/components/features/teachers/components/SummaryStrip";
import Table from "@/components/features/teachers/components/Table";
import TeacherCards from "@/components/features/teachers/components/TeacherCards";
import TeacherFormModal from "@/components/features/teachers/components/TeacherFormModal";
import { Modal, Pagination } from "@/components/ui";
import { useTeachersPageAnimation } from "@/animation/teachersPageAnimation";
import { useTeachers } from "@/context/TeacherContext";
import TeacherDetail from "./TeacherDetail";

const AllTeachers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    filteredTeachers,
    detailOpen,
    openDetail,
    closeDetail,
    page,
    pageCount,
    pageStart,
    pageEnd,
    setPage,
  } = useTeachers();

  useTeachersPageAnimation();

  useEffect(() => {
    if (id) openDetail(id);
    else closeDetail();
  }, [id]);

  return (
    <>
      <main className="main">
        <TopBar />
        <ConfirmDialog />

        <div className="page">
          <PageHead />
          <SummaryStrip />

          <section className="card">
            <CardHead />

            {/* Table (desktop / tablet) */}
            <Table />
            {/* Card list (mobile) */}
            <TeacherCards />

            <div className="card-foot">
              <span className="results-note">
                Showing{" "}
                <strong>
                  {pageStart}–{pageEnd}
                </strong>{" "}
                of <strong>{filteredTeachers.length}</strong> teachers
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
                  <span>10 / page</span>
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
          onClose={() => navigate("/allteachers")}
          size="lg">
          <TeacherDetail />
        </Modal>
      )}

      {/* Last so it stacks above the detail popup — both overlays share z-index 100. */}
      <TeacherFormModal />
    </>
  );
};

export default AllTeachers;
