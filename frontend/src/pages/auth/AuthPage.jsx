import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import LoginForm from "@/components/features/auth/LoginForm";
import SignupForm from "@/components/features/auth/SignupForm";
import AuthTabs from "@/components/features/auth/AuthTab";
import AuthBanner from "@/components/features/auth/AuthBanner";
import { wireHoverScale } from "@/animation/hover";

import "./AuthPage.css";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [role, setRole] = useState("admin");
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".auth-card",
        { opacity: 0, y: 24, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5 },
      )
        .fromTo(
          ".auth-visual-top",
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.35 },
          "-=0.35",
        )
        .fromTo(
          ".auth-visual-body h2, .auth-visual-body p",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
          "-=0.2",
        )
        .fromTo(
          ".auth-visual-card",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.15",
        )
        .fromTo(
          ".auth-panel.is-active .field, .auth-panel.is-active .role-switch, .auth-panel.is-active .auth-row, .auth-panel.is-active .checkbox-field--terms",
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.32,
            stagger: 0.05,
            onComplete: () => {
              wireHoverScale(".btn-block", 1.015);
              wireHoverScale(".visibility-toggle", 1.12);
              wireHoverScale(".role-option", 1.0);
            },
          },
          "-=0.25",
        );
    },
    { scope: containerRef },
  );

  return (
    <div className="auth-shell" ref={containerRef}>
      <div className="sidebar-overlay" />
      <AuthBanner />
      <main className="auth-main">
        <div className="auth-card">
          <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="auth-panels">
            <LoginForm
              isActive={activeTab === "login"}
              onSwitchToSignup={() => setActiveTab("signup")}
              role={role}
              onRoleChange={setRole}
            />
            <SignupForm
              isActive={activeTab === "signup"}
              onSwitchToLogin={() => setActiveTab("login")}
              role={role}
              onRoleChange={setRole}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
