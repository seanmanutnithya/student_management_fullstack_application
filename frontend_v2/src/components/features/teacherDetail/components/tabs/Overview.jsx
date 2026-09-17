import { BriefcaseBusiness, User } from "lucide-react";

import { useTeachers } from "@/context/TeacherContext";

const Overview = ({ activeTab }) => {
  const { openTeacher } = useTeachers();

  if (activeTab !== "overview" || !openTeacher) return null;

  const blocks = [
    {
      icon: User,
      title: "Contact information",
      items: [
        { dt: "Email", dd: openTeacher.email },
        { dt: "Phone", dd: openTeacher.phone },
        { dt: "Address", dd: openTeacher.address },
      ],
    },
    {
      icon: BriefcaseBusiness,
      title: "Professional information",
      items: [
        { dt: "Teacher ID", dd: `#${openTeacher.id}` },
        { dt: "Subject", dd: openTeacher.subject },
        { dt: "Department", dd: openTeacher.dept },
        { dt: "Qualification", dd: openTeacher.qualification },
        { dt: "Experience", dd: openTeacher.exp },
        { dt: "Employment type", dd: openTeacher.type },
        { dt: "Joining date", dd: openTeacher.joinDate },
      ],
    },
  ];

  return (
    <div
      className="detail-panel is-active"
      id="panel-overview"
      role="tabpanel"
      aria-labelledby="tab-overview"
      data-panel="overview">
      <div className="info-grid">
        {blocks.map(({ icon: Icon, title, items }) => (
          <div className="info-block" key={title}>
            <h3 className="info-block-title">
              <Icon />
              {title}
            </h3>
            <dl className="info-list">
              {items.map((item) => (
                <div key={item.dt}>
                  <dt>{item.dt}</dt>
                  <dd>{item.dd || "—"}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
