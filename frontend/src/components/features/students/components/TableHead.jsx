import { useStudent } from "@/context/StudentContext";
const TableHead = () => {
  const { isAllSelected, selectAll } = useStudent();
  return (
    <thead>
      <tr>
        <th className="col-check">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => selectAll(e.target.checked)}
          />
        </th>
        <th>Students Name</th>
        <th>ID</th>
        <th>Gender</th>
        <th>Class</th>
        <th>Phone</th>
        <th>Remark</th>
        <th className="col-action">Action</th>
      </tr>
    </thead>
  );
};
export default TableHead;
