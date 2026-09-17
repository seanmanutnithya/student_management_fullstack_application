import { useTeachers } from "@/context/TeacherContext";

const TableHead = () => {
  const { isAllSelected, selectAll } = useTeachers();

  return (
    <thead>
      <tr>
        <th className="col-check">
          <input
            type="checkbox"
            id="selectAll"
            aria-label="Select all"
            checked={isAllSelected}
            onChange={(e) => selectAll(e.target.checked)}
          />
        </th>
        <th>Teacher Name</th>
        <th>Teacher ID</th>
        <th>Subject</th>
        <th>Department</th>
        <th>Experience</th>
        <th>Phone</th>
        <th className="col-action">Action</th>
      </tr>
    </thead>
  );
};

export default TableHead;
