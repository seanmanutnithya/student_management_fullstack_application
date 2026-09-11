import { ChevronDown, Search, Calendar, Trash2 } from "lucide-react";
import { useStudent } from "@/context/StudentContext";
import { CardHeader, IconButton } from "@/components/ui";
const CardHead = () => {
  const { requestDeleteSelected } = useStudent();
  return (
    <CardHeader
      title="Students Information"
      actions={
        <>
          <div className="search-field search-field--sm">
            <Search />
            <input
              type="text"
              placeholder="Search by name or roll"
              aria-label="Search students"
            />
          </div>
          <button className="select-field" id="dateFilterBtn">
            <Calendar />
            <span>Last 30 days</span>
            <ChevronDown />
          </button>
          <IconButton
            ghost
            icon={Trash2}
            id="deleteSelectestudnetIDBtn"
            title="Delete selected"
            label="Delete selected"
            onClick={() => requestDeleteSelected()}
          />
        </>
      }
    />
  );
};

export default CardHead;
