import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithTestAuth } from "../lib/apiService";
import { useAuthStore, type UserProfile } from "../stores/authStore";
import { TEST_AUTH_SECRET, TEST_USER_ID } from "../config";

export default function TestLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Only show this page if test auth is configured
  if (!TEST_AUTH_SECRET || !TEST_USER_ID) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Test Login Not Available</h1>
        <p>Test authentication is not configured in this environment.</p>
      </div>
    );
  }

  const handleTestLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { accessToken, refreshToken } = await loginWithTestAuth(
        TEST_USER_ID,
        TEST_AUTH_SECRET
      );

      // Decode access token to get user profile
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      const userProfile: UserProfile = {
        userId: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture,
      };

      // Set authentication state directly (bypass Google OAuth flow)
      useAuthStore.setState({
        isAuthenticated: true,
        accessToken,
        refreshToken,
        user: userProfile,
        sessionHasExpired: false,
      });

      console.log("✅ Test login successful!", userProfile);
      navigate("/instructor-dashboard");
    } catch (err) {
      console.error("Test login failed:", err);
      setError(
        err instanceof Error ? err.message : "Test login failed. Check console."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Test Login (Beta Environment)</h1>
      <p>
        This page uses the <code>/auth/test-login</code> endpoint to bypass
        Google OAuth for testing purposes.
      </p>

      <div
        style={{
          background: "#f0f0f0",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1.5rem",
        }}
      >
        <strong>Test User ID:</strong>
        <br />
        <code>{TEST_USER_ID}</code>
      </div>

      <button
        onClick={handleTestLogin}
        disabled={loading}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#4285f4",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Logging in..." : "Login as Test User"}
      </button>

      {error && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#fee",
            color: "#c00",
            borderRadius: "4px",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginTop: "2rem", fontSize: "14px", color: "#666" }}>
        <p>
          After logging in, you'll be redirected to the instructor dashboard
          with demo student data.
        </p>
      </div>
    </div>
  );
}
