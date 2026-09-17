import { useCallback, useState } from "react";
import { Copy, RefreshCw, ShieldAlert, Smartphone } from "lucide-react";

import { DEMO_OTP, makeBackupCodes } from "@/assets/data/accountSeed";
import { Button, Modal, OtpModal, Switch, useToast } from "@/components/ui";

const TwoFactorSection = () => {
  const { toast } = useToast();

  const [enabled, setEnabled] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [codesOpen, setCodesOpen] = useState(false);

  // Turning on verifies first; turning off asks for confirmation.
  const handleToggle = useCallback((next) => {
    if (next) setOtpOpen(true);
    else setConfirmOpen(true);
  }, []);

  const verifyOtp = useCallback(
    (code) => {
      if (code !== DEMO_OTP) return false;
      setEnabled(true);
      setBackupCodes(makeBackupCodes());
      setOtpOpen(false);
      toast.success("Two-factor authentication is on");
      return true;
    },
    [toast],
  );

  const disable = () => {
    setEnabled(false);
    setBackupCodes([]);
    setConfirmOpen(false);
    toast.info("Two-factor authentication turned off");
  };

  const regenerate = () => {
    setBackupCodes(makeBackupCodes());
    setCodesOpen(true);
    toast.success("New backup codes generated");
  };

  const copyCodes = () => {
    navigator.clipboard
      ?.writeText(backupCodes.join("\n"))
      .then(() => toast.success("Backup codes copied"))
      .catch(() => toast.error("Couldn't copy — select and copy manually"));
  };

  return (
    <section className="account-section">
      <header className="account-section-head">
        <div>
          <h2>
            <ShieldAlert />
            Two-factor authentication
          </h2>
          <p>
            Ask for a one-time code from your authenticator app on every new
            sign-in.
          </p>
        </div>
        <Switch
          id="twoFactorSwitch"
          checked={enabled}
          onChange={handleToggle}
          label="Two-factor authentication"
        />
      </header>

      {enabled && (
        <div className="twofa-active">
          <div className="twofa-method">
            <span className="twofa-method-icon">
              <Smartphone />
            </span>
            <div>
              <strong>Authenticator app</strong>
              <span className="cell-sub">
                Active method · codes refresh every 30 seconds
              </span>
            </div>
            <span className="status-pill status-pill--green">Active</span>
          </div>

          <div className="twofa-actions">
            <Button
              size="sm"
              variant="secondary"
              icon={RefreshCw}
              onClick={regenerate}>
              Regenerate backup codes
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setCodesOpen(true)}
              disabled={backupCodes.length === 0}>
              View codes
            </Button>
          </div>
        </div>
      )}

      <OtpModal
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        onVerify={verifyOtp}
        title="Verify your device"
        description="Enter the 4-digit code from your authenticator app to finish turning on two-factor authentication."
        hint={`Demo build — use ${DEMO_OTP}`}
        confirmLabel="Turn on 2FA"
      />

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        size="sm"
        role="alertdialog"
        titleId="twofaConfirmTitle"
        bodyClassName="confirm-body"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Keep it on
            </Button>
            <Button variant="danger" icon={ShieldAlert} onClick={disable}>
              Turn off
            </Button>
          </>
        }>
        <div className="confirm-icon">
          <ShieldAlert />
        </div>
        <h3 id="twofaConfirmTitle">Turn off two-factor authentication?</h3>
        <p>
          Your account will be protected by password alone, and the backup codes
          you saved will stop working.
        </p>
      </Modal>

      <Modal
        open={codesOpen}
        onClose={() => setCodesOpen(false)}
        title="Backup codes"
        titleId="backupCodesTitle"
        size="sm"
        footer={
          <>
            <Button variant="secondary" icon={Copy} onClick={copyCodes}>
              Copy all
            </Button>
            <Button onClick={() => setCodesOpen(false)}>Done</Button>
          </>
        }>
        <p className="cell-sub backup-note">
          Each code works once. Store them somewhere safe — they're your way
          back in if you lose your phone.
        </p>
        <ul className="backup-codes">
          {backupCodes.map((code) => (
            <li key={code}>{code}</li>
          ))}
        </ul>
      </Modal>
    </section>
  );
};

export default TwoFactorSection;
