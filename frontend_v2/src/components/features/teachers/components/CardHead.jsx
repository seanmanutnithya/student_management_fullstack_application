import { Search, Trash2 } from "lucide-react";

import { CardHeader, IconButton } from "@/components/ui";
import { useTeachers } from "@/context/TeacherContext";

const CardHead = () => {
  const { query, setQuery, dept, setDept, departments, requestDeleteSelected } =
    useTeachers();

  return (
    <CardHeader
      title="Teachers Information"
      actions={
        <>
          <div className="search-field search-field--sm">
            <Search />
            <input
              type="text"
              placeholder="Search by name or ID"
              aria-label="Search teachers"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="select-field"
            id="deptFilterBtn"
            aria-label="Filter by department"
            value={dept}
            onChange={(e) => setDept(e.target.value)}>
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <IconButton
            ghost
            icon={Trash2}
            id="deleteSelectedBtn"
            title="Delete selected"
            label="Delete selected"
            onClick={requestDeleteSelected}
          />
        </>
      }
    />
  );
};

export default CardHead;
