// src/pages/ConfigurationPage.tsx
import React, { useState, useEffect, FormEvent } from "react";
import styles from "./ConfigurationPage.module.css";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore, Theme } from "../../stores/themeStore";
import {
  saveProgress as saveToLocalStorage,
  loadProgress as loadFromLocalStorage,
  ANONYMOUS_USER_ID_PLACEHOLDER,
} from "../../lib/localStorageUtils";
import { UI_CONFIG } from "../../config/constants";

const USER_PROFILE_STORAGE_KEY = "userProfileSettings";

interface UserProfileSettings {
  displayName: string;
}

const ConfigurationPage: React.FC = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const { theme, setTheme } = useThemeStore();
  const authUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Determine the current user ID for localStorage operations
  const currentStorageUserId =
    isAuthenticated && authUser
      ? authUser.userId
      : ANONYMOUS_USER_ID_PLACEHOLDER;

  // Load saved display name on component mount or when user changes
  useEffect(() => {
    const savedProfile = loadFromLocalStorage<UserProfileSettings>(
      currentStorageUserId,
      USER_PROFILE_STORAGE_KEY
    );
    if (savedProfile && savedProfile.displayName) {
      setDisplayName(savedProfile.displayName);
    } else if (authUser?.name) {
      // Fallback to Google name if no display name set
      setDisplayName(authUser.name);
    } else {
      setDisplayName(""); // Clear if no saved or default name
    }
  }, [currentStorageUserId, authUser]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const settingsToSave: UserProfileSettings = {
      displayName: displayName.trim(),
    };
    saveToLocalStorage(
      currentStorageUserId,
      USER_PROFILE_STORAGE_KEY,
      settingsToSave
    );

    setStatusMessage("Configuration saved!");
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setStatusMessage("");
    }, UI_CONFIG.SUCCESS_MESSAGE_DURATION_MS);
  };

  return (
    <div className={styles.configPageContainer}>
      <h2>Configuration Settings</h2>
      <p>Manage your application preferences.</p>

      <form onSubmit={handleSave} className={styles.configForm}>
        <div className={styles.configSection}>
          <h3>User Profile</h3>
          <div className={styles.formGroup}>
            <label htmlFor="display-name">Display Name:</label>
            <input
              type="text"
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How you want your name to appear"
            />
            <small>
              This name may be used in reflections or future features. It's
              stored locally in your browser.
            </small>
          </div>
        </div>

        <div className={styles.configSection}>
          <h3>Appearance</h3>
          <div className={styles.formGroup}>
            <label>Theme</label>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === "light"}
                  onChange={(e) => setTheme(e.target.value as Theme)}
                />
                Light
              </label>
              <label>
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === "dark"}
                  onChange={(e) => setTheme(e.target.value as Theme)}
                />
                Dark
              </label>
              <label>
                <input
                  type="radio"
                  name="theme"
                  value="system"
                  checked={theme === "system"}
                  onChange={(e) => setTheme(e.target.value as Theme)}
                />
                System
              </label>
            </div>
            <small>
              Choose how the application should look. 'System' will follow your
              OS setting.
            </small>
          </div>
        </div>

        <button type="submit" className={styles.saveButton}>
          Save Configuration
        </button>
        {isSaved && <p className={styles.saveStatus}>{statusMessage}</p>}
      </form>
    </div>
  );
};

export default ConfigurationPage;
