import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const AuthTabs = ({ activeTab, onTabChange }) => {
  const indicatorRef = useRef(null);

  useGSAP(() => {
    gsap.to(indicatorRef.current, {
      xPercent: activeTab === "login" ? 0 : 100,
      duration: 0.28,
      ease: "power3.out",
    });
  }, [activeTab]);

  return (
    <div className="auth-tabs" role="tablist">
      <button
        className={`auth-tab${activeTab === "login" ? " is-active" : ""}`}
        role="tab"
        aria-selected={activeTab === "login"}
        onClick={() => onTabChange("login")}
      >
        Log in
      </button>
      <button
        className={`auth-tab${activeTab === "signup" ? " is-active" : ""}`}
        role="tab"
        aria-selected={activeTab === "signup"}
        onClick={() => onTabChange("signup")}
      >
        Sign up
      </button>
      <span className="auth-tab-indicator" ref={indicatorRef} />
    </div>
  );
};

export default AuthTabs;
