// src/components/Header.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import { useAuthStore, useAuthActions } from "../stores/authStore";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V15A1.65 1.65 0 0 0 19.4 15z"></path>
  </svg>
);

const Header: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const { login, logout } = useAuthActions(); // Get actions

  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        // Just call the login action with the Google token
        await login(credentialResponse.credential);
      } catch (e) {
        console.error("Login process failed:", e);
      }
    } else {
      console.error("Login failed: No credential returned.");
    }
  };

  const handleLoginError = () => {
    console.error("Google Login Failed");
    // Optionally, show an error message to the user
  };

  const handleLogout = () => {
    logout(); // The logout action now handles the API call
  };

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
              <NavLink to="/python/learning-entries" className={getNavLinkClass}>
                Learning Entries
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Authentication Section */}
        <div className={styles.authSection}>
          {isAuthenticated && user ? (
            <>
              {user.picture && (
                <img
                  src={user.picture}
                  alt={user.name || "User"}
                  className={styles.profileImage}
                />
              )}
              <span className={styles.userName}>{user.name || user.email}</span>
              <button onClick={handleLogout} className={styles.authButton}>
                Logout
              </button>
            </>
          ) : (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              useOneTap // Optional: enable One Tap sign-in
              shape="rectangular" // Other options: "circle", "pill"
              theme="outline" // Other options: "filled_blue", "filled_black"
              size="medium" // Other options: "large", "small"
            />
          )}
        </div>

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
