import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UnitPage from "./pages/student/UnitPage";
import LessonPage from "./pages/student/LessonPage";
import CodeEditorPage from "./pages/student/CodeEditorPage";
import ProgressPage from "./pages/student/ProgressPage";
import LearningEntriesPage from "./pages/student/LearningEntriesPage";
import ConfigurationPage from "./pages/student/ConfigurationPage";
import InstructorDashboardPage from "./pages/instructor/InstructorDashboardPage";
import PrivacyPolicyPage from "./pages/static/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/static/TermsOfServicePage";
import FAQPage from "./pages/static/FAQPage";
import Layout from "./components/Layout";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import { useThemeStore } from "./stores/themeStore";
import { useProgressStore, useProgressActions } from "./stores/progressStore";
import { useAuthStore } from "./stores/authStore";
import StudentLayout from "./components/StudentLayout";
import SyncingOverlay from "./components/SyncingOverlay";
import SessionExpiredModal from "./components/SessionExpiredModal";
import { PROGRESS_CONFIG } from "./config/constants";
import { useStoreCoordination } from "./hooks/useStoreCoordination";

function App() {
  // Coordinate auth and progress stores
  useStoreCoordination();

  const theme = useThemeStore((state) => state.theme);
  const isSyncingProgress = useAuthStore((state) => state.isSyncingProgress);
  const sessionHasExpired = useAuthStore((state) => state.sessionHasExpired);
  const { logout, setSessionExpired } = useAuthStore((state) => state.actions);
  const penaltyEndTime = useProgressStore((state) => state.penaltyEndTime);
  const { clearPenalty } = useProgressActions();

  const handleModalClose = () => {
    logout(); // Peforms a full logout, clearing the stale state
    setSessionExpired(false); // Reset the flag for the next session
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-dark");

    if (theme === "light") {
      root.classList.add("theme-light");
    } else if (theme === "dark") {
      root.classList.add("theme-dark");
    }
    // If theme is 'system', no class is added, and the CSS media query takes over.
  }, [theme]);

  useEffect(() => {
    if (penaltyEndTime === null) {
      return;
    }
    const checkPenalty = () => {
      if (Date.now() >= penaltyEndTime) {
        clearPenalty();
      }
    };
    checkPenalty();
    const intervalId = setInterval(
      checkPenalty,
      PROGRESS_CONFIG.PENALTY_CHECK_INTERVAL_MS
    );
    return () => clearInterval(intervalId);
  }, [penaltyEndTime, clearPenalty]);

  return (
    <>
      {isSyncingProgress && <SyncingOverlay />}
      <SessionExpiredModal
        isOpen={sessionHasExpired}
        onClose={handleModalClose}
      />
      <Routes>
        {/* Root redirect to default curriculum */}
        <Route path="/" element={<Navigate to="/python/" replace />} />

        {/* General/shared routes (available across all curricula) */}
        <Route element={<Layout />}>
          <Route path="/configure" element={<ConfigurationPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Route>

        {/* Python curriculum routes */}
        <Route path="/python" element={<StudentLayout />}>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="unit/:unitId" element={<UnitPage />} />
            <Route path="lesson/*" element={<LessonPage />} />
            <Route path="editor" element={<CodeEditorPage />} />
            <Route path="learning-entries" element={<LearningEntriesPage />} />
            <Route
              path="progress"
              element={
                <AuthenticatedRoute>
                  <ProgressPage />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="instructor-dashboard/*"
              element={<InstructorDashboardPage />}
            />
            <Route
              path="*"
              element={
                <div>
                  <h2>404 - Page Not Found</h2>
                </div>
              }
            />
          </Route>
        </Route>

        {/* Future: Scratch curriculum would go here */}
        {/* <Route path="/scratch" element={<StudentLayout />}>...</Route> */}

        {/* Catch-all 404 for unknown routes */}
        <Route
          path="*"
          element={
            <div>
              <h2>404 - Page Not Found</h2>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
