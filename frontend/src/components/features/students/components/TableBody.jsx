import { Link } from "react-router-dom";
import Actions from "./Actions";
import { useStudent } from "@/context/StudentContext";

const TableBody = () => {
  const { students, selectedIds, toggleSelect } = useStudent();
  return (
    <tbody id="studentsTbody">
      {/* <!-- rows injected by script.js --> */}
      {students.map((s, idx) => (
        <tr
          data-index={idx}
          className={`table-row${selectedIds.includes(s.id) ? " is-selected" : ""}`}
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
          <td>{s.id}</td>
          <td>{s.gender}</td>
          <td>{s.std_class}</td>
          <td>{s.phone}</td>
          <td>{s.remark == null ? "" : s.remark}</td>
          <td className="col-action">
            <Actions name={s.name} id={s.id} />
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
