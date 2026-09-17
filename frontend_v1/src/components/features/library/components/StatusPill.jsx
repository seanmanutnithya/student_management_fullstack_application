import { statusMeta } from "@/assets/data/libraryAssets";

/* One pill for both copy availability (available / checked-out / reserved)
   and loan status (borrowed / overdue / returned). */
const StatusPill = ({ status }) => {
  const meta = statusMeta[status];
  if (!meta) return null;

  const { label, icon: Icon, tone } = meta;

  return (
    <span className={`status-pill status-pill--${tone}`}>
      <Icon />
      {label}
    </span>
  );
};

export default StatusPill;
