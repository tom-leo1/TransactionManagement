import { useEffect } from "react";
import { createPortal } from "react-dom";

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timeoutId = window.setTimeout(onClose, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [onClose]);

  return createPortal(
    <div className="notification" role="alert">
      <div className="notification-content">
        <h4 className="notification-title">Notification</h4>
        <p className="notification-message">{message}</p>
      </div>
      <button
        aria-label="Close notification"
        className="notification-close"
        onClick={onClose}
        type="button"
      >
        ×
      </button>
      <div aria-hidden="true" className="notification-progress" />
    </div>,
    document.body
  );
};

export default Notification;
