import { ArrowRight, TriangleAlert, UserRoundCheck } from "lucide-react";

import { Button, Modal } from "@/components/ui";
import { useClasses } from "@/context/ClassContext";

const TransferConfirm = () => {
  const {
    pendingTransfer,
    transferCheck,
    transferring,
    confirmTransfer,
    cancelTransfer,
    rows,
  } = useClasses();

  const student = pendingTransfer?.student;
  const from = rows.find((k) => k.id === student?.fromId);
  const to = rows.find((k) => k.id === pendingTransfer?.toId);

  return (
    <Modal
      open={Boolean(pendingTransfer)}
      onClose={cancelTransfer}
      title="Transfer student"
      titleId="transferTitle"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={cancelTransfer}>
            Cancel
          </Button>
          <Button
            icon={UserRoundCheck}
            loading={transferring}
            disabled={!transferCheck.ok}
            onClick={confirmTransfer}>
            Confirm transfer
          </Button>
        </>
      }>
      {student && (
        <div className="transfer-body">
          <div className="transfer-student">
            <img className="student-avatar" src={student.avatar} alt="" />
            <div>
              <strong>{student.name}</strong>
              <span className="cell-sub">{student.id}</span>
            </div>
          </div>

          <div className="transfer-route">
            <span className="transfer-node">
              <span className="cell-sub">From</span>
              <strong>{from?.id ?? student.fromId}</strong>
              <span className="cell-sub">
                {from ? `${from.enrolled} of ${from.capacity}` : ""}
              </span>
            </span>
            <ArrowRight className="transfer-arrow" aria-hidden="true" />
            <span className="transfer-node">
              <span className="cell-sub">To</span>
              <strong>{to?.id ?? pendingTransfer.toId}</strong>
              <span className="cell-sub">
                {to ? `${to.enrolled} of ${to.capacity}` : ""}
              </span>
            </span>
          </div>

          {transferCheck.ok ?
            <p className="transfer-note is-ok">
              Both registers update immediately, and the capacity rings move
              with them.
            </p>
          : <p className="transfer-note is-blocked">
              <TriangleAlert />
              {transferCheck.reason}
            </p>
          }
        </div>
      )}
    </Modal>
  );
};

export default TransferConfirm;
