import { memo, useCallback, useState } from "react";
import { LogOut } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { seedSessions } from "@/assets/data/accountSeed";
import { Button, useToast } from "@/components/ui";

const SessionRow = memo(function SessionRow({ session, onSignOut }) {
  const Icon = session.icon;

  return (
    <li className="session-row" data-session-id={session.id}>
      <span className="session-icon">
        <Icon />
      </span>
      <div className="session-meta">
        <strong>
          {session.browser} · {session.os}
          {session.current && (
            <span className="status-pill status-pill--green">This device</span>
          )}
        </strong>
        <span className="cell-sub">
          {session.location} · {session.lastActive}
        </span>
      </div>
      {!session.current && (
        <button
          className="row-action-btn delete"
          title={`Sign out of ${session.browser} on ${session.os}`}
          aria-label={`Sign out of ${session.browser} on ${session.os}`}
          onClick={() => onSignOut(session.id)}>
          <LogOut />
        </button>
      )}
    </li>
  );
});

const SessionsSection = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState(seedSessions);

  useStaggerReveal(".session-row", [sessions.length], {
    y: 8,
    duration: 0.35,
    stagger: 0.04,
  });

  const signOut = useCallback(
    (id) => {
      setSessions((prev) => {
        const target = prev.find((s) => s.id === id);
        if (target) toast.success(`Signed out of ${target.browser}`);
        return prev.filter((s) => s.id !== id);
      });
    },
    [toast],
  );

  const signOutOthers = () => {
    const others = sessions.filter((s) => !s.current).length;
    if (others === 0) {
      toast.info("No other devices are signed in");
      return;
    }
    setSessions((prev) => prev.filter((s) => s.current));
    toast.success(`Signed out of ${others} other device(s)`);
  };

  const others = sessions.filter((s) => !s.current).length;

  return (
    <section className="account-section">
      <header className="account-section-head">
        <div>
          <h2>Active sessions</h2>
          <p>Devices currently signed in to this account.</p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          icon={LogOut}
          onClick={signOutOthers}
          disabled={others === 0}>
          Sign out everywhere else
        </Button>
      </header>

      <ul className="session-list">
        {sessions.map((session) => (
          <SessionRow
            key={session.id}
            session={session}
            onSignOut={signOut}
          />
        ))}
      </ul>
    </section>
  );
};

export default SessionsSection;
