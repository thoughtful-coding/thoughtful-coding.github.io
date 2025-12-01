// src/components/Header.tsx
import React from "react";
import { NavLink, useParams } from "react-router-dom";
import styles from "./Header.module.css";
import SettingsIcon from "./icons/SettingsIcon";
import AuthSection from "./auth/AuthSection";
import { useAuthHandlers } from "../hooks/useAuthHandlers";

const Header: React.FC = () => {
  const { courseId } = useParams<{ courseId?: string }>();
  const { handleLoginSuccess, handleLoginError, handleLogout } =
    useAuthHandlers();

  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <NavLink to="/" className={styles.titleLink}>
          {" "}
          {/* Logo links to all courses homepage */}
          <h1 className={styles.title}>Thoughtful Code</h1>
        </NavLink>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {/* Show Code Editor and Learning Entries when NOT in a course */}
            {!courseId && (
              <>
                <li>
                  <NavLink to="/code-editor" className={getNavLinkClass}>
                    Code Editor
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/learning-entries" className={getNavLinkClass}>
                    Learning Entries
                  </NavLink>
                </li>
              </>
            )}

            {/* Show Progress and Learning Entries only when IN a course */}
            {courseId && (
              <>
                <li>
                  <NavLink
                    to={`/${courseId}/progress`}
                    className={getNavLinkClass}
                  >
                    Progress
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/learning-entries"
                    className={getNavLinkClass}
                  >
                    Learning Entries
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Authentication Section */}
        <AuthSection
          onLoginSuccess={handleLoginSuccess}
          onLoginError={handleLoginError}
          onLogout={handleLogout}
          styles={{
            authSection: styles.authSection,
            profileImage: styles.profileImage,
            userName: styles.userName,
            authButton: styles.authButton,
          }}
        />

        <div className={styles.settingsArea}>
          <NavLink
            to="/configure"
            className={styles.settingsLink}
            title="Configure Settings"
          >
            <SettingsIcon />
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
