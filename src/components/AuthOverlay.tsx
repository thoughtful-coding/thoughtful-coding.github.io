import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import styles from "./AuthOverlay.module.css";

interface AuthOverlayProps {
  message: string;
}

const AuthOverlay: React.FC<AuthOverlayProps> = ({ message }) => {
  return (
    <div className={styles.overlayBackdrop}>
      <div className={styles.overlayContent}>
        <LoadingSpinner />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AuthOverlay;
