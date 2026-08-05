import styles from "./MessagesModule.module.css";
import { MdError } from "react-icons/md";

export function MessagesModule({ response, onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <span>
          <MdError />
        </span>

        <p>{response.message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
