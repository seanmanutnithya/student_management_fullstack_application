import TableBody from "./TableBody";
import TableHead from "./TableHead";

const Table = () => (
  <div className="table-wrap">
    <table className="table" id="teachersTable">
      <TableHead />
      <TableBody />
    </table>
  </div>
);

export default Table;
