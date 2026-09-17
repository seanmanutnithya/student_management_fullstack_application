import { memo, useCallback, useState } from "react";
import { BellOff } from "lucide-react";

import { notificationEvents } from "@/assets/data/accountSeed";
import { Switch, useToast } from "@/components/ui";

/* Memoised so flipping one toggle re-renders that row only. */
const NotificationRow = memo(function NotificationRow({
  event,
  prefs,
  paused,
  onToggle,
}) {
  const Icon = event.icon;

  return (
    <div className={`notify-row${paused ? " is-paused" : ""}`}>
      <div className="notify-label">
        <span className="notify-icon">
          <Icon />
        </span>
        <div>
          <strong>{event.label}</strong>
          <span className="cell-sub">{event.hint}</span>
        </div>
      </div>
      <div className="notify-toggle">
        <Switch
          size="sm"
          checked={prefs.email}
          disabled={paused}
          onChange={(value) => onToggle(event.key, "email", value)}
          label={`Email for ${event.label}`}
        />
      </div>
      <div className="notify-toggle">
        <Switch
          size="sm"
          checked={prefs.inApp}
          disabled={paused}
          onChange={(value) => onToggle(event.key, "inApp", value)}
          label={`In-app for ${event.label}`}
        />
      </div>
    </div>
  );
});

const initialPrefs = Object.fromEntries(
  notificationEvents.map((e) => [e.key, { email: e.email, inApp: e.inApp }]),
);

const NotificationsSection = () => {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState(initialPrefs);
  const [paused, setPaused] = useState(false);

  const handleToggle = useCallback((key, channel, value) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: { ...prev[key], [channel]: value },
    }));
  }, []);

  const handlePause = useCallback(
    (value) => {
      setPaused(value);
      toast.info(
        value ?
          "All notifications paused"
        : "Notifications resumed",
      );
    },
    [toast],
  );

  return (
    <section className="account-section">
      <header className="account-section-head">
        <div>
          <h2>Notification preferences</h2>
          <p>Choose how you hear about each kind of activity.</p>
        </div>
      </header>

      <div className={`pause-all${paused ? " is-on" : ""}`}>
        <span className="pause-all-icon">
          <BellOff />
        </span>
        <div className="pause-all-text">
          <strong>Pause all notifications</strong>
          <span className="cell-sub">
            Mutes every channel without losing your choices below.
          </span>
        </div>
        <Switch
          id="pauseAll"
          checked={paused}
          onChange={handlePause}
          label="Pause all notifications"
        />
      </div>

      <div className="notify-grid" role="table" aria-label="Notification preferences">
        <div className="notify-head" role="row">
          <span role="columnheader">Event</span>
          <span role="columnheader">Email</span>
          <span role="columnheader">In-app</span>
        </div>

        {notificationEvents.map((event) => (
          <NotificationRow
            key={event.key}
            event={event}
            prefs={prefs[event.key]}
            paused={paused}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </section>
  );
};

export default NotificationsSection;
