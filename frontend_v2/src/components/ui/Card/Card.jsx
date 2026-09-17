import CardHeader from "./CardHeader";

const Card = ({
  as: As = "section",
  title,
  icon,
  actions,
  footer,
  padding = "md",
  className = "",
  children,
}) => (
  <As
    className={["card", className].filter(Boolean).join(" ")}
    style={padding === "none" ? { padding: 0 } : undefined}>
    {(title || actions) && (
      <CardHeader title={title} icon={icon} actions={actions} />
    )}
    {children}
    {footer}
  </As>
);

export default Card;
