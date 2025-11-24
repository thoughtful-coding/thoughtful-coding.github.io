import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { act } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import { useAuthStore } from "./stores/authStore";
import { useThemeStore } from "./stores/themeStore";

// A helper function to render the App component with all necessary context providers.
const renderWithRouter = (initialEntries = ["/"]) => {
  // A dummy client ID is sufficient for testing purposes.
  const clientId = "test-client-id";

  return render(
    <GoogleOAuthProvider clientId={clientId}>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </GoogleOAuthProvider>
  );
};

describe("App Component", () => {
  // Test suite for routing behavior
  describe("Routing", () => {
    test("should display a 404 page for a non-existent route", () => {
      const badRoute = "/this-route-does-not-exist";
      renderWithRouter([badRoute]);

      // Check for the heading of the 404 page
      expect(
        screen.getByRole("heading", { name: "404 - Page Not Found" })
      ).toBeInTheDocument();
    });
  });

  // Test suite for UI elements that appear based on global state
  describe("State-driven UI", () => {
    test("should display AuthOverlay when isLoggingIn is true", () => {
      renderWithRouter();

      // The overlay should not be visible initially
      expect(screen.queryByText("Signing in...")).not.toBeInTheDocument();

      // Manually set the isLoggingIn state to true
      act(() => {
        useAuthStore.setState({ isLoggingIn: true });
      });

      // Assert that the overlay's content is now visible
      expect(screen.getByText("Signing in...")).toBeInTheDocument();
    });

    test("should display AuthOverlay when isLoggingOut is true", () => {
      renderWithRouter();

      // The overlay should not be visible initially
      expect(screen.queryByText("Signing out...")).not.toBeInTheDocument();

      // Manually set the isLoggingOut state to true
      act(() => {
        useAuthStore.setState({ isLoggingOut: true });
      });

      // Assert that the overlay's content is now visible
      expect(screen.getByText("Signing out...")).toBeInTheDocument();
    });

    test("should display the SessionExpiredModal when sessionHasExpired is true", () => {
      renderWithRouter();

      // The modal should not be visible initially
      expect(screen.queryByText("Session Expired")).not.toBeInTheDocument();

      // Manually set the session expired state to true
      act(() => {
        useAuthStore.getState().actions.setSessionExpired(true);
      });

      // Assert that the modal's title is now visible
      expect(screen.getByText("Session Expired")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Your session has timed out. Please log in again to continue."
        )
      ).toBeInTheDocument();
    });
  });

  // Test suite for DOM manipulations based on state
  describe("Theme Handling", () => {
    test("should apply the correct theme class to the root element", () => {
      renderWithRouter();
      const root = document.documentElement;

      // Test for 'dark' theme
      act(() => {
        useThemeStore.setState({ theme: "dark" });
      });
      expect(root.classList.contains("theme-dark")).toBe(true);
      expect(root.classList.contains("theme-light")).toBe(false);

      // Test for 'light' theme
      act(() => {
        useThemeStore.setState({ theme: "light" });
      });
      expect(root.classList.contains("theme-light")).toBe(true);
      expect(root.classList.contains("theme-dark")).toBe(false);

      // Test for 'system' theme (no class should be applied)
      act(() => {
        useThemeStore.setState({ theme: "system" });
      });
      expect(root.classList.contains("theme-light")).toBe(false);
      expect(root.classList.contains("theme-dark")).toBe(false);
    });
  });
});
