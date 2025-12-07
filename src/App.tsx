import { useEffect } from "react";
import { Routes, Route, useOutletContext } from "react-router-dom";
import type { Course, Unit } from "./types/data";
import type { InstructorStudentInfo } from "./types/apiServiceTypes";
import CoursesHomePage from "./pages/CoursesHomePage";
import CourseHomePage from "./pages/CourseHomePage";
import UnitPage from "./pages/student/UnitPage";
import LessonPage from "./pages/student/LessonPage";
import CodeEditorPage from "./pages/student/CodeEditorPage";
import ProgressPage from "./pages/student/ProgressPage";
import LearningEntriesPage from "./pages/student/LearningEntriesPage";
import ConfigurationPage from "./pages/student/ConfigurationPage";
import InstructorDashboardPage from "./pages/instructor/InstructorDashboardPage";
import ReviewClassProgressView from "./components/instructor/ReviewClassProgressView";
import ReviewByAssignmentView from "./components/instructor/ReviewByAssignmentView";
import ReviewByStudentView from "./components/instructor/ReviewByStudentView";
import ReviewLearningEntriesView from "./components/instructor/ReviewLearningEntriesView";
import PrivacyPolicyPage from "./pages/static/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/static/TermsOfServicePage";
import FAQPage from "./pages/static/FAQPage";
import Layout from "./components/Layout";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import { useThemeStore } from "./stores/themeStore";
import { useProgressStore, useProgressActions } from "./stores/progressStore";
import { useAuthStore } from "./stores/authStore";
import StudentLayout from "./components/StudentLayout";
import AuthOverlay from "./components/AuthOverlay";
import SessionExpiredModal from "./components/SessionExpiredModal";
import { PROGRESS_CONFIG } from "./config/constants";
import { useStoreCoordination } from "./hooks/useStoreCoordination";

// Wrapper components for instructor routes that use Outlet context
function InstructorProgressWrapper() {
  const { allCourses, allUnits, permittedStudents, isLoading, error } =
    useOutletContext<{
      allCourses: Course[];
      allUnits: Unit[];
      permittedStudents: InstructorStudentInfo[];
      isLoading: boolean;
      error: string | null;
    }>();
  return (
    <ReviewClassProgressView
      courses={allCourses}
      units={allUnits}
      permittedStudents={permittedStudents}
      isLoadingUnitsGlobal={isLoading}
      isLoadingStudentsGlobal={isLoading}
      studentsErrorGlobal={error}
    />
  );
}

function InstructorAssignmentsWrapper() {
  const { allCourses, allUnits, permittedStudents } = useOutletContext<{
    allCourses: Course[];
    allUnits: Unit[];
    permittedStudents: InstructorStudentInfo[];
  }>();
  return (
    <ReviewByAssignmentView
      courses={allCourses}
      units={allUnits}
      permittedStudents={permittedStudents}
    />
  );
}

function InstructorStudentsWrapper() {
  const { allCourses, allUnits, permittedStudents } = useOutletContext<{
    allCourses: Course[];
    allUnits: Unit[];
    permittedStudents: InstructorStudentInfo[];
  }>();
  return (
    <ReviewByStudentView
      courses={allCourses}
      units={allUnits}
      permittedStudents={permittedStudents}
    />
  );
}

function InstructorLearningEntriesWrapper() {
  const { allUnits, permittedStudents } = useOutletContext<{
    allUnits: Unit[];
    permittedStudents: InstructorStudentInfo[];
  }>();
  return (
    <ReviewLearningEntriesView
      units={allUnits}
      permittedStudents={permittedStudents}
    />
  );
}

function App() {
  // Coordinate auth and progress stores
  useStoreCoordination();

  const theme = useThemeStore((state) => state.theme);
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn);
  const isLoggingOut = useAuthStore((state) => state.isLoggingOut);
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
      {isLoggingIn && <AuthOverlay message="Signing in..." />}
      {isLoggingOut && <AuthOverlay message="Signing out..." />}
      <SessionExpiredModal
        isOpen={sessionHasExpired}
        onClose={handleModalClose}
      />
      <Routes>
        {/* Instructor dashboard (MUST come first - define nested routes here) */}
        <Route
          path="/instructor-dashboard"
          element={<InstructorDashboardPage />}
        >
          <Route index element={<InstructorProgressWrapper />} />
          <Route path="progress" element={<InstructorProgressWrapper />} />
          <Route
            path="assignments"
            element={<InstructorAssignmentsWrapper />}
          />
          <Route path="students" element={<InstructorStudentsWrapper />} />
          <Route
            path="learning-entries"
            element={<InstructorLearningEntriesWrapper />}
          />
        </Route>

        {/* General/shared routes (available globally) */}
        <Route element={<Layout />}>
          <Route index element={<CoursesHomePage />} />
          <Route path="/configure" element={<ConfigurationPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Route>

        {/* Code Editor and Learning Entries need Pyodide, so wrap with StudentLayout */}
        <Route path="/code-editor" element={<StudentLayout />}>
          <Route element={<Layout />}>
            <Route index element={<CodeEditorPage />} />
          </Route>
        </Route>
        <Route path="/learning-entries" element={<StudentLayout />}>
          <Route element={<Layout />}>
            <Route index element={<LearningEntriesPage />} />
          </Route>
        </Route>

        {/* Course-specific routes (courseId parameter) - MUST come last as it's a catch-all */}
        <Route path="/:courseId" element={<StudentLayout />}>
          <Route element={<Layout />}>
            <Route index element={<CourseHomePage />} />
            <Route path="unit/:unitId" element={<UnitPage />} />
            <Route path="lesson/*" element={<LessonPage />} />
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
              path="*"
              element={
                <div>
                  <h2>404 - Page Not Found</h2>
                </div>
              }
            />
          </Route>
        </Route>

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
