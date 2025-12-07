import React, { useState, useEffect } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";

import * as apiService from "../../lib/apiService";
import { useAuthStore } from "../../stores/authStore";
import type { InstructorStudentInfo } from "../../types/apiServiceTypes";
import type { Unit, Course } from "../../types/data";
import { fetchUnitsData, getCoursesAsync } from "../../lib/dataLoader";
import { sortByStudentName } from "../../lib/instructorHelpers";
import { BASE_PATH } from "../../config";
import { useAuthHandlers } from "../../hooks/useAuthHandlers";
import SettingsIcon from "../../components/icons/SettingsIcon";
import AuthSection from "../../components/auth/AuthSection";

// Import the page/view components
import LoadingSpinner from "../../components/LoadingSpinner";
import Footer from "../../components/Footer";
import styles from "./InstructorDashboardPage.module.css";

const navLinks = [
  { path: "/instructor-dashboard/progress", label: "Class Progress" },
  { path: "/instructor-dashboard/assignments", label: "By Assignment" },
  { path: "/instructor-dashboard/students", label: "By Student" },
  {
    path: "/instructor-dashboard/learning-entries",
    label: "Final Learning Entries",
  },
];

const InstructorDashboardPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { handleLoginSuccess, handleLoginError, handleLogout } =
    useAuthHandlers({ redirectOnLogout: "/" });

  // States to fetch shared data now live here
  const [permittedStudents, setPermittedStudents] = useState<
    InstructorStudentInfo[]
  >([]);
  const [allUnits, setAllUnits] = useState<Unit[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
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
        const [studentsResponse, unitsData, coursesData] = await Promise.all([
          apiService.getInstructorPermittedStudents(),
          fetchUnitsData(),
          getCoursesAsync(),
        ]);
        setPermittedStudents(sortByStudentName(studentsResponse.students));
        setAllUnits(unitsData.units);
        setAllCourses(coursesData);
      } catch (err) {
        setError("Failed to load initial instructor data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCommonData();
  }, [isAuthenticated]);

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
              <Link to="/" className={styles.backToStudentLink}>
                &larr; Back to Courses
              </Link>
            </div>
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
          <h2>Instructor Dashboard Demo</h2>
          <p
            style={{
              maxWidth: "600px",
              margin: "1rem auto 0.5rem auto",
              fontSize: "1.1em",
            }}
          >
            Click "Sign in with Google" above to explore a live demo with three
            sample students.
          </p>
          {/* Example image */}
          <div
            style={{
              maxWidth: "1200px",
              margin: "2rem auto",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <img
              src={`${BASE_PATH}images/instructor-dashboard-example.png`}
              alt="Instructor Dashboard Preview"
              style={{ display: "block", width: "100%" }}
            />
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
            <Link to="/" className={styles.backToStudentLink}>
              &larr; Back to Courses
            </Link>
          </div>
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
            showGoogleLoginWhenUnauthenticated={false}
            showLogoutButton={false}
          />
          <div className={styles.settingsArea}>
            {user && (
              <button onClick={handleLogout} className={styles.authButton}>
                Logout
              </button>
            )}
            <Link
              to="/configure"
              className={styles.settingsLink}
              title="Configure Settings"
            >
              <SettingsIcon />
            </Link>
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
          <Outlet
            context={{
              allUnits,
              allCourses,
              permittedStudents,
              isLoading,
              error,
            }}
          />
        )}
      </main>
      <Footer variant="instructor" />
    </div>
  );
};

export default InstructorDashboardPage;
