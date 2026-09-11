import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { GraduationCap, ShieldCheck } from "lucide-react";

const ROLES = [
  { value: "admin", label: "Admin", icon: ShieldCheck },
  { value: "teacher", label: "Teacher", icon: GraduationCap },
];

const RoleSwitch = ({ value, onChange, formName }) => {
  const pillRef = useRef(null);
  const activeIndex = ROLES.findIndex((role) => role.value === value);

  useGSAP(() => {
    gsap.to(pillRef.current, {
      xPercent: activeIndex * 100,
      duration: 0.28,
      ease: "power3.out",
    });
  }, [activeIndex]);

  return (
    <div className="role-switch" data-form={formName}>
      <span className="role-switch-pill" ref={pillRef} />
      {ROLES.map((role) => (
        <button
          key={role.value}
          type="button"
          className={`role-option${value === role.value ? " is-active" : ""}`}
          onClick={() => onChange(role.value)}>
          <role.icon />
          <span>{role.label}</span>
        </button>
      ))}
    </div>
  );
};

export default RoleSwitch;
