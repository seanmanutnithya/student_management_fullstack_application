const Button = ({
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  block = false,
  className = "",
  children,
  type = "button",
  disabled,
  ...rest
}) => {
  const classes = [
    "btn",
    `btn-${variant}`,
    size === "sm" && "btn-sm",
    block && "btn-block",
    loading && "is-loading",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...rest}>
      {Icon && <Icon />}
      <span className="btn-label">{children}</span>
      {loading && <span className="btn-spinner" />}
    </button>
  );
};

export default Button;
