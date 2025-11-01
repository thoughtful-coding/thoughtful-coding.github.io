// src/pages/PrivacyPolicyPage.tsx
import React from "react";
import styles from "./StaticPage.module.css";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className={styles.staticPageContainer}>
      <h1>Privacy Policy</h1>
      <p className={styles.lastUpdated}>Last Updated: October 25, 2025</p>

      <section className={styles.section}>
        <h2>1. Information We Collect</h2>
        <p>
          <em>Thoughtful Coding</em> collects the following information to
          provide our educational services:
        </p>
        <ul>
          <li>
            <strong>Account Information:</strong> When you sign in with Google,
            we collect your name and email address.
          </li>
          <li>
            <strong>Learning Progress:</strong> We track your lesson completion,
            section progress, and quiz results to personalize your learning
            experience.
          </li>
          <li>
            <strong>Code Submissions:</strong> Your code submissions for
            exercises, reflections, and PRIMM activities are stored to provide
            feedback and track progress.
          </li>
          <li>
            <strong>Local Storage:</strong> For anonymous users, progress is
            stored locally in your browser. This data never leaves your device
            unless you create an account.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul>
          <li>Provide and improve our educational platform</li>
          <li>
            Track your learning progress across devices (authenticated users)
          </li>
          <li>Provide AI-powered feedback on your code submissions</li>
          <li>Analyze usage patterns to improve lesson content</li>
          <li>Communicate important updates about the platform</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>3. Data Storage and Security</h2>
        <p>Your data is stored securely using industry-standard practices:</p>
        <ul>
          <li>All data transmission is encrypted using HTTPS</li>
          <li>Authentication is handled securely through Google OAuth</li>
          <li>
            Progress data is synchronized to AWS servers for authenticated users
          </li>
          <li>
            We do not sell or share your personal information with third parties
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>4. Anonymous Users</h2>
        <p>
          You can use <em>Thoughtful Coding</em> without creating an account.
          Anonymous users:
        </p>
        <ul>
          <li>Have their progress stored locally in their browser only</li>
          <li>Do not have data synchronized across devices</li>
          <li>Can clear their data at any time by clearing browser storage</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Request deletion of your account and associated data</li>
          <li>Export your learning progress</li>
          <li>Opt out of data collection by using the platform anonymously</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>6. Third-Party Services</h2>
        <p>
          <em>Thoughtful Coding</em> uses the following third-party services:
        </p>
        <ul>
          <li>
            <strong>Google OAuth:</strong> For authentication (subject to{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google's Privacy Policy
            </a>
            )
          </li>
          <li>
            <strong>AWS:</strong> For backend services and data storage
          </li>
          <li>
            <strong>Pyodide:</strong> For running Python code in your browser
            (all execution happens client-side)
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>7. Contact Us</h2>
        <p>
          If you have questions about this privacy policy or your data, please
          contact us through our{" "}
          <a
            href="https://eric-rizzi.github.io/teaching/"
            target="_blank"
            rel="noopener noreferrer"
          >
            About Us
          </a>{" "}
          page.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
