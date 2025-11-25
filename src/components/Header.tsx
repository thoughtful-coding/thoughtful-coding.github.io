// src/components/Header.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import SettingsIcon from "./icons/SettingsIcon";
import AuthSection from "./auth/AuthSection";
import { useAuthHandlers } from "../hooks/useAuthHandlers";

const Header: React.FC = () => {
  const { handleLoginSuccess, handleLoginError, handleLogout } =
    useAuthHandlers();

  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <NavLink to="/python/" className={styles.titleLink}>
          {" "}
          {/* Wrap title in NavLink */}
          <h1 className={styles.title}>Thoughtful Python</h1>
        </NavLink>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <NavLink to="/python/" className={getNavLinkClass} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/python/editor" className={getNavLinkClass}>
                Code Editor
              </NavLink>
            </li>
            <li>
              {" "}
              {/* Added <li> wrapper for consistency */}
              <NavLink to="/python/progress" className={getNavLinkClass}>
                Progress
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/python/learning-entries"
                className={getNavLinkClass}
              >
                Learning Entries
              </NavLink>
            </li>
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
