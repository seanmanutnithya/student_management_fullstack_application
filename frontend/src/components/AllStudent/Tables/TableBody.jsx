import Actions from "../Actions";
import students from "../../../../../database/data.json";
import { useRef } from "react";
import { wireRowSelection } from "../JS/wireRowSelection";
const TableBody = () => {
  const selectBoxRef = useRef(null);
  const handleSelectBox = () => wireRowSelection(selectBoxRef.current);
  return (
    <tbody id="studentsTbody">
      {/* <!-- rows injected by script.js --> */}
      {students.map((s, idx) => (
        <tr data-index={idx} key={idx}>
          <td className="col-check">
            <input
              type="checkbox"
              className="row-check"
              aria-label={`Select ${s.name}`}
              ref={selectBoxRef}
              onChange={handleSelectBox}
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
          <Actions name={s.name} />
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
