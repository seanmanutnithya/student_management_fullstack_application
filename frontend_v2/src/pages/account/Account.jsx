import "@/styles/account.css";

import { useState } from "react";

import TopBar from "@/components/layout/TopBar";
import AccountTabs from "@/components/features/account/components/AccountTabs";
import DangerZone from "@/components/features/account/components/DangerZone";
import NotificationsSection from "@/components/features/account/components/NotificationsSection";
import PageHead from "@/components/features/account/components/PageHead";
import PasswordSection from "@/components/features/account/components/PasswordSection";
import PreferencesSection from "@/components/features/account/components/PreferencesSection";
import ProfileSection from "@/components/features/account/components/ProfileSection";
import SessionsSection from "@/components/features/account/components/SessionsSection";
import TwoFactorSection from "@/components/features/account/components/TwoFactorSection";
import {
  useAccountPageAnimation,
  useTabCrossfade,
} from "@/animation/accountPageAnimation";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";

/* Panels stay mounted and are hidden with CSS rather than unmounted, so a
   half-filled form survives a tab switch. Each section owns its own state,
   so a toggle in Notifications never re-renders the profile form. */
const Account = () => {
  const [activeTab, setActiveTab] = useState("profile");

  useAccountPageAnimation();
  useTabCrossfade(activeTab);
  useHideScrollbar();

  const panelClass = (tab) =>
    `account-panel${activeTab === tab ? " is-active" : ""}`;

  return (
    <main className="main">
      <TopBar />

      <div className="page">
        <PageHead />

        <section className="card account-card">
          <AccountTabs activeTab={activeTab} onChange={setActiveTab} />

          <div className="account-panels">
            <div
              className={panelClass("profile")}
              id="panel-profile"
              role="tabpanel"
              aria-labelledby="tab-profile">
              <ProfileSection />
            </div>

            <div
              className={panelClass("security")}
              id="panel-security"
              role="tabpanel"
              aria-labelledby="tab-security">
              <PasswordSection />
              <TwoFactorSection />
              <SessionsSection />
            </div>

            <div
              className={panelClass("notifications")}
              id="panel-notifications"
              role="tabpanel"
              aria-labelledby="tab-notifications">
              <NotificationsSection />
            </div>

            <div
              className={panelClass("preferences")}
              id="panel-preferences"
              role="tabpanel"
              aria-labelledby="tab-preferences">
              <PreferencesSection />
              <DangerZone />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Account;
