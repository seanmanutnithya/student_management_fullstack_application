import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/* Generalised from the auth RoleSwitch: a GSAP pill slides under whichever
   option is active, for any number of options. */
const SegmentedControl = ({ options, value, onChange, label }) => {
  const pillRef = useRef(null);
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  useGSAP(() => {
    gsap.to(pillRef.current, {
      xPercent: activeIndex * 100,
      duration: 0.28,
      ease: "power3.out",
    });
  }, [activeIndex]);

  return (
    <div
      className="segmented"
      role="radiogroup"
      aria-label={label}
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      <span
        className="segmented-pill"
        ref={pillRef}
        aria-hidden="true"
        style={{ width: `calc(${100 / options.length}% - 4px)` }}
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          className={`segmented-option${
            value === option.value ? " is-active" : ""
          }`}
          onClick={() => onChange?.(option.value)}>
          {option.icon && <option.icon />}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
