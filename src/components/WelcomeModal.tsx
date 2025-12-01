import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./WelcomeModal.module.css";

const MODAL_SEEN_KEY = "hasSeenRoleSelector";

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleSelection = (role: "student" | "instructor") => {
    // Set the flag in localStorage so this doesn't appear again
    localStorage.setItem(MODAL_SEEN_KEY, "true");

    if (role === "instructor") {
      navigate("/instructor-dashboard");
    }

    // Close the modal for both choices
    onClose();
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>Welcome to Thoughtful Code!</h2>
        <p>To help us tailor your experience, please let us know your role.</p>
        <div className={styles.buttonContainer}>
          <button
            onClick={() => handleSelection("student")}
            className={styles.studentButton}
          >
            I'm a Student
          </button>
          <button
            onClick={() => handleSelection("instructor")}
            className={styles.instructorButton}
          >
            I'm an Instructor
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
