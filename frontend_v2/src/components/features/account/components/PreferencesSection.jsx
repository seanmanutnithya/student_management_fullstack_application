import { useCallback, useState } from "react";
import { Globe, Laptop, Moon, Save, Sun } from "lucide-react";

import {
  languages,
  seedPreferences,
  timezones,
} from "@/assets/data/accountSeed";
import { Button, Field, SegmentedControl, useToast } from "@/components/ui";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
];

const PreferencesSection = () => {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState(seedPreferences);

  const handleSelect = useCallback((e) => {
    const { name, value } = e.target;
    setPrefs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleTheme = useCallback(
    (theme) => setPrefs((prev) => ({ ...prev, theme })),
    [],
  );

  const save = () => toast.success("Preferences saved");

  return (
    <section className="account-section">
      <header className="account-section-head">
        <div>
          <h2>
            <Globe />
            Preferences
          </h2>
          <p>Language, time zone and appearance for your account.</p>
        </div>
      </header>

      <div className="form-grid">
        <Field label="Language" htmlFor="prefLanguage">
          <select
            id="prefLanguage"
            name="language"
            value={prefs.language}
            onChange={handleSelect}>
            {languages.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Time zone" htmlFor="prefTimezone">
          <select
            id="prefTimezone"
            name="timezone"
            value={prefs.timezone}
            onChange={handleSelect}>
            {timezones.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Theme"
          className="field--full"
          hint="System follows your device setting.">
          <SegmentedControl
            options={THEMES}
            value={prefs.theme}
            onChange={handleTheme}
            label="Theme"
          />
        </Field>
      </div>

      <div className="account-section-foot">
        <Button icon={Save} onClick={save}>
          Save preferences
        </Button>
      </div>
    </section>
  );
};

export default PreferencesSection;
