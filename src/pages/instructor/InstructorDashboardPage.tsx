import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate, Link } from "react-router-dom"; // Import routing components
import {
  CredentialResponse,
  GoogleLogin,
  googleLogout,
} from "@react-oauth/google";

import * as apiService from "../../lib/apiService";
import { useAuthStore, useAuthActions } from "../../stores/authStore";
import type { InstructorStudentInfo } from "../../types/apiServiceTypes";
import type { Unit } from "../../types/data";
import { fetchUnitsData } from "../../lib/dataLoader";
import { BASE_PATH } from "../../config";

// Import the page/view components
import ReviewClassProgressView from "../../components/instructor/ReviewClassProgressView";
import ReviewByAssignmentView from "../../components/instructor/ReviewByAssignmentView";
import ReviewStudentDetailView from "../../components/instructor/shared/ReviewStudentDetailView";
import LoadingSpinner from "../../components/LoadingSpinner";
import ReviewByStudentView from "../../components/instructor/ReviewByStudentView";
import Footer from "../../components/Footer";
import styles from "./InstructorDashboardPage.module.css";
import ReviewLearningEntriesView from "../../components/instructor/ReviewLearningEntriesView";

const navLinks = [
  { path: "/python/instructor-dashboard/progress", label: "Class Progress" },
  { path: "/python/instructor-dashboard/assignments", label: "By Assignment" },
  { path: "/python/instructor-dashboard/students", label: "By Student" },
  {
    path: "/python/instructor-dashboard/learning-entries",
    label: "Final Learning Entries",
  },
];

const InstructorDashboardPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { login, logout } = useAuthActions();
  const navigate = useNavigate();

  // States to fetch shared data now live here
  const [permittedStudents, setPermittedStudents] = useState<
    InstructorStudentInfo[]
  >([]);
  const [allUnits, setAllUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data needed by multiple child pages
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    const loadCommonData = async () => {
      if (!isAuthenticated) return;
      setIsLoading(true);
      setError(null);
      try {
        const [studentsResponse, unitsData] = await Promise.all([
          apiService.getInstructorPermittedStudents(),
          fetchUnitsData(),
        ]);
        setPermittedStudents(studentsResponse.students);
        setAllUnits(unitsData.units);
      } catch (err) {
        setError("Failed to load initial instructor data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCommonData();
  }, [isAuthenticated]);

  const handleLogout = () => {
    googleLogout();
    logout();
    navigate("/python/");
  };

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        await login(credentialResponse.credential);
      } catch (e) {
        console.error("Login process failed:", e);
      }
    } else {
      console.error("Login failed: No credential returned from Google.");
    }
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return isActive
      ? `${styles.instructorNavLink} ${styles.instructorNavLinkActive}`
      : styles.instructorNavLink;
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.pageWrapper}>
        <header className={styles.instructorHeader}>
          <div className={styles.headerMain}>
            <div>
              <h1>Thoughtful Dashboard</h1>
              <Link to="/python/" className={styles.backToStudentLink}>
                &larr; Back to Student View
              </Link>
            </div>
          </div>
          <nav className={styles.instructorNav}>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={getNavLinkClass}
                end
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main
          className={styles.mainContentArea}
          style={{ textAlign: "center", padding: "1rem 1rem" }}
        >
          <h2>Please Log In to Continue</h2>
          <p style={{ maxWidth: "600px", margin: "1rem auto 2rem auto" }}>
            Access to the instructor dashboard is restricted. Please log in with
            your authorized Google account to view student data.
          </p>
          {/* Added styling for the GoogleLogin button */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginBottom: "2rem",
            }}
          >
            <div style={{ width: "300px" }}>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.error("Google Login Failed")}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      backgroundColor: "#fff",
                      color: "#333",
                      cursor: "pointer",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <img
                      src="https://developers.google.com/identity/images/g-logo.png"
                      alt="Google logo"
                      style={{ marginRight: "0.5rem", height: "20px" }}
                    />
                    Sign in with Google
                  </button>
                )}
              />
            </div>
          </div>
          {/* Added the example image */}
          <div
            style={{
              maxWidth: "800px",
              margin: "2rem auto",
              border: "1px solid #eee",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <h3>Example Dashboard View (Logged In)</h3>
            <img
              src={`${BASE_PATH}images/instructor-dashboard-example.png`}
              alt="Example Instructor Dashboard"
              style={{ display: "block", width: "100%" }}
            />
            <p
              style={{
                padding: "1rem",
                backgroundColor: "#f9f9f9",
                fontSize: "0.9em",
                color: "#777",
                textAlign: "left",
              }}
            >
              This is an example of what the instructor dashboard looks like
              when you are logged in and have student data available. You will
              be able to see progress overviews, review submissions by
              assignment or student, and view individual student details.
            </p>
          </div>
        </main>
        <Footer variant="instructor" />
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.instructorHeader}>
        <div className={styles.headerMain}>
          <div>
            <h1>Thoughtful Dashboard</h1>
            <Link to="/python/" className={styles.backToStudentLink}>
              &larr; Back to Student View
            </Link>
          </div>
          <div className={styles.authSection}>
            {user && (
              <>
                {user.picture && (
                  <img
                    src={user.picture}
                    alt={user.name || "User"}
                    className={styles.profileImage}
                  />
                )}
                <span className={styles.userName}>
                  {user.name || user.email}
                </span>
                <button onClick={handleLogout} className={styles.authButton}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
        <nav className={styles.instructorNav}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={getNavLinkClass}
              end // Add the 'end' prop here
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className={styles.mainContentArea}>
        {isLoading ? (
          <LoadingSpinner message="Loading dashboard data..." />
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : (
          <Routes>
            <Route
              index
              element={
                <ReviewClassProgressView
                  units={allUnits}
                  permittedStudents={permittedStudents}
                  isLoadingUnitsGlobal={isLoading}
                  isLoadingStudentsGlobal={isLoading}
                  studentsErrorGlobal={error}
                />
              }
            />
            <Route
              path="progress"
              element={
                <ReviewClassProgressView
                  units={allUnits}
                  permittedStudents={permittedStudents}
                  isLoadingUnitsGlobal={isLoading}
                  isLoadingStudentsGlobal={isLoading}
                  studentsErrorGlobal={error}
                />
              }
            />
            <Route
              path="assignments"
              element={
                <ReviewByAssignmentView
                  units={allUnits}
                  permittedStudents={permittedStudents}
                />
              }
            />
            <Route
              path="students"
              element={
                <ReviewByStudentView permittedStudents={permittedStudents} />
              }
            />
            <Route
              path="students/:studentId"
              element={<ReviewStudentDetailView units={allUnits} />}
            />
            <Route
              path="learning-entries"
              element={
                <ReviewLearningEntriesView
                  units={allUnits}
                  permittedStudents={permittedStudents}
                />
              }
            />
          </Routes>
        )}
      </main>
      <Footer variant="instructor" />
    </div>
  );
};

export default InstructorDashboardPage;
