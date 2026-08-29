import TableHead from "./TableHead";
import TableBody from "./TableBody";

const Table = () => {
  return (
    <div className="table-wrap">
      <table className="table" id="studentsTable">
        <TableHead />
        <TableBody />
      </table>
    </div>
  );
};

export default Table;
