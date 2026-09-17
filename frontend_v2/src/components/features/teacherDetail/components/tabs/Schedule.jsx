import { teacherSchedule } from "@/assets/data/teacherTabAssets";
import { useTeachers } from "@/context/TeacherContext";

const Schedule = ({ activeTab }) => {
  const { openTeacher } = useTeachers();

  if (activeTab !== "schedule" || !openTeacher) return null;

  return (
    <div
      className="detail-panel is-active"
      id="panel-schedule"
      role="tabpanel"
      aria-labelledby="tab-schedule"
      data-panel="schedule">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Room</th>
            </tr>
          </thead>
          <tbody>
            {teacherSchedule.map((row, idx) => (
              <tr key={idx}>
                <td>{row.day}</td>
                <td>{row.slot}</td>
                <td>{row.cls}</td>
                <td>
                  <span className="subject-pill">{openTeacher.subject}</span>
                </td>
                <td>{row.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;
