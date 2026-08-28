import TableHead from "./Tables/TableHead";
import TableBody from "./Tables/TableBody";

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
