// ConfirmDialog Component - a reusable confirmation popup
// Shows a message with Cancel / Confirm buttons and an overlay behind it
// Props:
//   open        - whether the dialog should be visible (boolean)
//   title       - heading text for the dialog
//   message     - the question/explanation shown to the user
//   confirmLabel- text on the confirm button (default 'Delete')
//   confirming  - disables the buttons while an action is running (boolean)
//   onCancel    - function called when the user clicks Cancel
//   onConfirm   - function called when the user clicks the confirm button

import Button from './Button';

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  confirming = false,
  onCancel,
  onConfirm,
}) => {
  // Don't render anything at all while the dialog is closed
  if (!open) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog" role="dialog" aria-modal="true">
        <h3 className="dialog-title">{title}</h3>
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          <Button variant="secondary" onClick={onCancel} disabled={confirming}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={confirming}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;