import Actions from "./Actions";
import { useStudent } from "../context/StudentContext";

const TableBody = () => {
  const { students, selectedIds, toggleSelect } = useStudent();
  return (
    <tbody id="studentsTbody">
      {/* <!-- rows injected by script.js --> */}
      {students.map((s, idx) => (
        <tr
          data-index={idx}
          className={selectedIds.includes(s.id) ? "is-selected" : ""}
          key={s.id}>
          <td className="col-check">
            <input
              type="checkbox"
              className="row-check"
              aria-label={`Select ${s.name}`}
              checked={selectedIds.includes(s.id)}
              onChange={() => toggleSelect(s.id)}
            />
          </td>
          <td>
            <div className="student-name-cell">
              <span className="student-name">{s.name}</span>
            </div>
          </td>
          <td>{s.ids}</td>
          <td>{s.gender}</td>
          <td>{s.std_class}</td>
          <td>{s.phone}</td>
          <td>{s.remark == null ? "" : s.remark}</td>
          <Actions name={s.name} id={s.id} />
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
