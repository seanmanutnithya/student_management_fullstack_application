import { FEES, FEE_STATUS } from "../../utils/renderFees";

const Fees = ({ activeTab }) => {
  if (activeTab !== "fees") return null;
  return (
    <div
      className="detail-panel is-active"
      id="panel-fees"
      role="tabpanel"
      aria-labelledby="tab-fees"
      data-panel="fees">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Description</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="feesBody">
            {FEES.map((row) => {
              const { icon: Icon, label } = FEE_STATUS[row.status];
              return (
                <tr key={row.invoice}>
                  <td>{row.invoice}</td>
                  <td>{row.desc}</td>
                  <td>{row.date}</td>
                  <td>{row.amount}</td>
                  <td>
                    <span className={`fee-status fee-status--${row.status}`}>
                      <Icon />
                      {label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fees;
