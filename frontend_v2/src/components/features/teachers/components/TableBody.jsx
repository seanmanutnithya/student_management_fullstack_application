import { useTeachers } from "@/context/TeacherContext";
import { resolveAvatarSrc } from "@/utils/avatar";
import Actions from "./Actions";

const TableBody = () => {
  const { pagedTeachers, selectedIds, toggleSelect } = useTeachers();

  return (
    <tbody id="teachersTbody">
      {pagedTeachers.map((t) => (
        <tr
          key={t.id}
          data-row-id={t.id}
          className={`table-row${selectedIds.includes(t.id) ? " is-selected" : ""}`}>
          <td className="col-check">
            <input
              type="checkbox"
              className="row-check"
              aria-label={`Select ${t.name}`}
              checked={selectedIds.includes(t.id)}
              onChange={() => toggleSelect(t.id)}
            />
          </td>
          <td>
            <div className="student-name-cell">
              <img
                className="student-avatar"
                src={resolveAvatarSrc(t.avatar)}
                alt=""
                loading="lazy"
              />
              <span className="student-name">{t.name}</span>
            </div>
          </td>
          <td>#{t.id}</td>
          <td>
            <span className="subject-pill">{t.subject}</span>
          </td>
          <td>{t.dept}</td>
          <td>{t.exp}</td>
          <td>{t.phone}</td>
          <td className="col-action">
            <Actions name={t.name} id={t.id} />
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
