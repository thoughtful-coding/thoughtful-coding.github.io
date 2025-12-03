// src/components/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

interface FooterProps {
  variant?: "default" | "instructor";
}

const Footer: React.FC<FooterProps> = ({ variant = "default" }) => {
  const currentYear = new Date().getFullYear();

  const footerClassName =
    variant === "instructor"
      ? `${styles.footer} ${styles.instructorFooter}`
      : styles.footer;

  return (
    <footer className={footerClassName}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <nav className={styles.linkGrid}>
            <div className={styles.linkColumn}>
              <h3 className={styles.columnTitle}>About</h3>
              <a
                href="https://eric-rizzi.github.io/teaching/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                About Us
              </a>
              <Link to="/faq" className={styles.link}>
                FAQ
              </Link>
            </div>

            <div className={styles.linkColumn}>
              <h3 className={styles.columnTitle}>For Teachers</h3>
              <Link to="/instructor-dashboard" className={styles.link}>
                Teacher Portal
              </Link>
              <a
                href="https://github.com/eric-rizzi/ucls-hs-intro-to-cs"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Curriculum
              </a>
            </div>

            <div className={styles.linkColumn}>
              <h3 className={styles.columnTitle}>Legal</h3>
              <Link to="/privacy-policy" className={styles.link}>
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className={styles.link}>
                Terms of Service
              </Link>
            </div>

            <div className={styles.linkColumn}>
              <h3 className={styles.columnTitle}>Open Source</h3>
              <a
                href="https://github.com/thoughtful-coding/thoughtful-coding.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Front-End Source
              </a>
              <a
                href="https://github.com/thoughtful-coding/thoughtful-backend"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Back-End Source
              </a>
            </div>
          </nav>
          <p className={styles.copyright}>
            &copy; {currentYear} Thoughtful Coding Lessons
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
