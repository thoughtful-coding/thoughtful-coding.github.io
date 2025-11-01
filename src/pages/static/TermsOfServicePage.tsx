// src/pages/TermsOfServicePage.tsx
import React from "react";
import styles from "./StaticPage.module.css";

const TermsOfServicePage: React.FC = () => {
  return (
    <div className={styles.staticPageContainer}>
      <h1>Terms of Service</h1>
      <p className={styles.lastUpdated}>Last Updated: October 25, 2025</p>

      <section className={styles.section}>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using <em>Thoughtful Coding</em>, you accept and
          agree to be bound by these Terms of Service. If you do not agree to
          these terms, please do not use our platform.
        </p>
      </section>

      <section className={styles.section}>
        <h2>2. Description of Service</h2>
        <p>
          <em>Thoughtful Coding</em> is a free, open-source educational platform
          designed to teach programming through interactive lessons, exercises,
          and AI-powered feedback. The platform runs primarily in your browser.
        </p>
      </section>

      <section className={styles.section}>
        <h2>3. User Accounts</h2>
        <p>Users may access the platform in two ways:</p>
        <ul>
          <li>
            <strong>Anonymous Access:</strong> Use the platform without an
            account. Progress is stored locally in your browser only.
          </li>
          <li>
            <strong>Authenticated Access:</strong> Sign in with Google to sync
            progress across devices and access additional features.
          </li>
        </ul>
        <p>You are responsible for maintaining the security of your account.</p>
      </section>

      <section className={styles.section}>
        <h2>4. Acceptable Use</h2>
        <p>
          When using <em>Thoughtful Coding</em>, you agree to:
        </p>
        <ul>
          <li>Use the platform for legitimate educational purposes</li>
          <li>Not attempt to disrupt or compromise the platform's security</li>
          <li>Not use the platform to store or distribute malicious code</li>
          <li>Respect other users and instructors</li>
          <li>
            Not abuse AI evaluation features or attempt to manipulate results
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>5. Intellectual Property</h2>
        <p>
          <em>Thoughtful Coding</em> is open-source software. The source code is
          available under the terms specified in the repository's license:
        </p>
        <ul>
          <li>
            <a
              href="https://github.com/thoughtful-coding/thoughtful-coding.github.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              Front-End Source Code
            </a>
          </li>
          <li>
            <a
              href="https://github.com/thoughtful-coding/thoughtful-backend"
              target="_blank"
              rel="noopener noreferrer"
            >
              Back-End Source Code
            </a>
          </li>
        </ul>
        <p>
          Lesson content, exercises, and original educational materials are
          copyright of their respective authors. Your code submissions remain
          your intellectual property.
        </p>
      </section>

      <section className={styles.section}>
        <h2>6. User-Generated Content</h2>
        <p>
          When you submit code, reflections, or other content to{" "}
          <em>Thoughtful Coding</em>:
        </p>
        <ul>
          <li>You retain ownership of your content</li>
          <li>
            You grant us permission to store and process your content to provide
            educational services
          </li>
          <li>
            Your content may be reviewed by instructors or AI systems for
            evaluation purposes
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>7. Disclaimer of Warranties</h2>
        <p>
          <em>Thoughtful Coding</em> is provided "as is" without warranties of
          any kind. We do not guarantee:
        </p>
        <ul>
          <li>Uninterrupted or error-free operation</li>
          <li>That the platform will meet your specific learning needs</li>
          <li>The accuracy or completeness of AI-generated feedback</li>
          <li>
            That your data will never be lost (always back up important work)
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>8. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, <em>Thoughtful Coding</em> and
          its creators shall not be liable for any indirect, incidental,
          special, or consequential damages arising from your use of the
          platform.
        </p>
      </section>

      <section className={styles.section}>
        <h2>9. Privacy</h2>
        <p>
          Your use of <em>Thoughtful Coding</em> is also governed by our{" "}
          <a href="/privacy-policy">Privacy Policy</a>. Please review it to
          understand how we collect and use your information.
        </p>
      </section>

      <section className={styles.section}>
        <h2>10. Modifications to Service</h2>
        <p>
          We reserve the right to modify, suspend, or discontinue any aspect of
          <em>Thoughtful Coding</em> at any time without notice. We may also
          update these terms periodically.
        </p>
      </section>

      <section className={styles.section}>
        <h2>11. Termination</h2>
        <p>
          We reserve the right to terminate or suspend access to the platform
          for users who violate these terms or engage in abusive behavior.
        </p>
      </section>

      <section className={styles.section}>
        <h2>12. Contact</h2>
        <p>
          Questions about these Terms of Service? Contact us through our{" "}
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

export default TermsOfServicePage;
