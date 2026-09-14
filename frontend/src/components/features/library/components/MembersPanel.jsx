import { useStaggerReveal } from "@/animation/reveal";
import { useLibrary } from "@/context/LibraryContext";
import MemberDetail from "./MemberDetail";
import MemberList from "./MemberList";

const MembersPanel = ({ activeTab }) => {
  const { selectedStudentId } = useLibrary();
  const isActive = activeTab === "members";

  useStaggerReveal(".loan-row", [isActive, selectedStudentId], {
    y: 8,
    duration: 0.35,
    stagger: 0.035,
  });

  if (!isActive) return null;

  return (
    <section
      className="library-panel"
      id="panel-members"
      role="tabpanel"
      aria-labelledby="tab-members">
      <div className="member-layout">
        <MemberList />
        <MemberDetail />
      </div>
    </section>
  );
};

export default MembersPanel;
