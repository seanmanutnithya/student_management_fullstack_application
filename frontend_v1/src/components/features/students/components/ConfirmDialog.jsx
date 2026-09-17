import { Trash2 } from "lucide-react";
import { useStudent } from "@/context/StudentContext";
import { Modal, Button } from "@/components/ui";

const ConfirmDialog = () => {
  const { confirmOpen, confirmDelete, cancelDelete } = useStudent();

  return (
    <Modal
      open={confirmOpen}
      onClose={cancelDelete}
      size="sm"
      role="alertdialog"
      titleId="confirmTitle"
      bodyClassName="confirm-body"
      overlayId="confirmOverlay"
      footer={
        <>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" icon={Trash2} onClick={confirmDelete}>
            Delete
          </Button>
        </>
      }>
      <div className="confirm-icon">
        <Trash2 />
      </div>
      <h3 id="confirmTitle">Delete this student?</h3>
      <p>
        This action can't be undone. The student record will be permanently
        removed.
      </p>
    </Modal>
  );
};

export default ConfirmDialog;
