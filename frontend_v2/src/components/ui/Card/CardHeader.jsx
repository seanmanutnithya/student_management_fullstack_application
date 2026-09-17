const CardHeader = ({ title, icon: Icon, actions, className = "" }) => (
  <div className={["card-head", className].filter(Boolean).join(" ")}>
    <h2 className="card-title">
      {Icon && <Icon />}
      {title}
    </h2>
    {actions && <div className="card-head-actions">{actions}</div>}
  </div>
);

export default CardHeader;
