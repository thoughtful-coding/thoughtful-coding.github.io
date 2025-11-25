// src/components/auth/AuthSection.tsx
import React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuthStore } from "../../stores/authStore";

interface AuthSectionProps {
  onLoginSuccess: (credentialResponse: CredentialResponse) => void;
  onLoginError: () => void;
  onLogout: () => void;
  styles: {
    authSection: string;
    profileImage: string;
    userName: string;
    authButton: string;
  };
  showGoogleLoginWhenUnauthenticated?: boolean;
  showLogoutButton?: boolean;
}

/**
 * Shared auth section component for displaying user auth UI
 * Shows profile, username, and optionally logout button when authenticated
 * Optionally shows Google login button when not authenticated
 */
const AuthSection: React.FC<AuthSectionProps> = ({
  onLoginSuccess,
  onLoginError,
  onLogout,
  styles,
  showGoogleLoginWhenUnauthenticated = true,
  showLogoutButton = true,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  return (
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
          {showLogoutButton && (
            <button onClick={onLogout} className={styles.authButton}>
              Logout
            </button>
          )}
        </>
      ) : (
        showGoogleLoginWhenUnauthenticated && (
          <GoogleLogin
            onSuccess={onLoginSuccess}
            onError={onLoginError}
            useOneTap
            shape="rectangular"
            theme="outline"
            size="medium"
          />
        )
      )}
    </div>
  );
};

export default AuthSection;
