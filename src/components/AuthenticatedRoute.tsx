// src/components/AuthenticatedRoute.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import LoadingSpinner from "./LoadingSpinner";
import styles from "./AuthenticatedRoute.module.css";

interface AuthenticatedRouteProps {
  children: JSX.Element;
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
  children,
}) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner message="Verifying authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("User not authenticated. Path attempted:", location.pathname);
    return (
      <div className={styles.authRequiredContainer}>
        <h2 className={styles.authRequiredHeader}>Authentication Required</h2>
        <p className={styles.authRequiredMessage}>
          Please log in to access this page and its functionality.
        </p>
        <Link to="/python/" className={styles.homeLink}>
          Go to Home Page to Log In
        </Link>
        <p className={styles.additionalInfo}>
          If you believe this is an error, please try refreshing the page or
          contacting support.
        </p>
      </div>
    );
  }

  return children;
};

export default AuthenticatedRoute;
