import { useState } from "react";
import { TriangleAlert, UserX } from "lucide-react";

import { seedProfile } from "@/assets/data/accountSeed";
import { Button, Field, Modal, useToast } from "@/components/ui";

const DangerZone = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");

  // Deliberately exact: a near-miss shouldn't unlock a destructive action.
  const confirmed = typed.trim() === seedProfile.email;

  const close = () => {
    setOpen(false);
    setTyped("");
  };

  const deactivate = () => {
    close();
    toast.info("Account deactivation requested — an admin will confirm it.");
  };

  return (
    <section className="account-section danger-zone">
      <header className="account-section-head">
        <div>
          <h2>
            <TriangleAlert />
            Danger zone
          </h2>
          <p>
            Deactivating hides your profile and revokes access on every device.
            Only an administrator can restore it.
          </p>
        </div>
        <Button variant="danger" icon={UserX} onClick={() => setOpen(true)}>
          Deactivate account
        </Button>
      </header>

      <Modal
        open={open}
        onClose={close}
        title="Deactivate account"
        titleId="deactivateTitle"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button variant="danger" icon={UserX} disabled={!confirmed} onClick={deactivate}>
              Deactivate
            </Button>
          </>
        }>
        <div className="deactivate-body">
          <p>
            This signs you out everywhere and removes your access to student
            records, fees and notices.
          </p>
          <p className="deactivate-instruction">
            Type <strong>{seedProfile.email}</strong> to confirm.
          </p>
          <Field label="Confirm your email" htmlFor="deactivateEmail">
            <input
              id="deactivateEmail"
              type="email"
              autoComplete="off"
              placeholder={seedProfile.email}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
            />
          </Field>
        </div>
      </Modal>
    </section>
  );
};

export default DangerZone;
