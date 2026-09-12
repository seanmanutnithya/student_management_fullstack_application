import { Trash2 } from "lucide-react";

import { Button, Modal } from "@/components/ui";
import { useLibrary } from "@/context/LibraryContext";

const ConfirmDialog = () => {
  const { confirmOpen, pendingDeleteBook, confirmDelete, cancelDelete } =
    useLibrary();

  const history = pendingDeleteBook?.historyCount ?? 0;
  const holds = pendingDeleteBook?.holdCount ?? 0;

  return (
    <Modal
      open={confirmOpen}
      onClose={cancelDelete}
      size="sm"
      role="alertdialog"
      titleId="bookConfirmTitle"
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
      <h3 id="bookConfirmTitle">
        Delete {pendingDeleteBook ? `"${pendingDeleteBook.title}"` : "this book"}
        ?
      </h3>
      <p>
        This action can't be undone. All {pendingDeleteBook?.copiesTotal ?? 0}{" "}
        copies leave the catalog
        {history > 0 &&
          `, along with ${history} past loan record${history === 1 ? "" : "s"}`}
        {holds > 0 &&
          ` and ${holds} queued hold${holds === 1 ? "" : "s"}`}
        .
      </p>
    </Modal>
  );
};

export default ConfirmDialog;
