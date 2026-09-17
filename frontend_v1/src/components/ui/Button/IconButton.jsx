const IconButton = ({
  icon: Icon,
  ghost = false,
  label,
  className = "",
  iconClassName = "",
  children,
  type = "button",
  ...rest
}) => {
  const classes = ["icon-btn", ghost && "icon-btn--ghost", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} aria-label={label} {...rest}>
      <Icon className={iconClassName || undefined} />
      {children}
    </button>
  );
};

export default IconButton;
