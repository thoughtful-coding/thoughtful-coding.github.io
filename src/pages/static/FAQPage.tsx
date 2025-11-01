// src/pages/FAQPage.tsx
import React from "react";
import styles from "./StaticPage.module.css";

const FAQPage: React.FC = () => {
  return (
    <div className={styles.staticPageContainer}>
      <h1>Frequently Asked Questions</h1>

      <section className={styles.section}>
        <h2>Getting Started</h2>

        <div className={styles.faqItem}>
          <h3>
            Do I need to create an account to use <em>Thoughtful Coding</em>?
          </h3>
          <p>
            No! You can use <em>Thoughtful Coding</em> completely anonymously.
            Your progress will be saved locally in your browser. However, if you
            want to sync your progress across devices, access your learning
            history from multiple computers, or get feedback from AI on your
            progress, you can sign in with your Google account.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>Do I need to install anything on my computer?</h3>
          <p>
            No installation is required! <em>Thoughtful Coding</em> runs
            entirely in your browser. This means you can start coding
            immediately without any setup.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>What if I lose my progress?</h3>
          <p>
            For anonymous users, progress is stored in your browser's local
            storage. Clearing your browser data will delete your progress. For
            authenticated users, progress is synced to our servers and will be
            restored when you sign in again.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Learning Features</h2>

        <div className={styles.faqItem}>
          <h3>What types of exercises are available?</h3>
          <p>
            <em>Thoughtful Coding</em> offers several types of learning
            activities:
          </p>
          <ul>
            <li>
              <strong>Information sections:</strong> Learn concepts through text
              and examples
            </li>
            <li>
              <strong>Observation sections:</strong> View and run code examples
            </li>
            <li>
              <strong>Testing sections:</strong> Write code to pass automated
              tests
            </li>
            <li>
              <strong>Prediction sections:</strong> Predict code output before
              running
            </li>
            <li>
              <strong>PRIMM activities:</strong> Predict, Run, Investigate,
              Modify, Make with AI feedback
            </li>
            <li>
              <strong>Reflection activities:</strong> Free-form coding with AI
              evaluation
            </li>
            <li>
              <strong>Quizzes:</strong> Multiple choice, matching, and selection
              questions
            </li>
          </ul>
        </div>

        <div className={styles.faqItem}>
          <h3>How does the AI feedback work?</h3>
          <p>
            For PRIMM and Reflection sections, we use AI to evaluate your code
            submissions and provide personalized feedback. The AI checks if your
            code meets the requirements and offers suggestions for improvement.
            However, AI feedback should be considered as guidance - always
            verify with your instructor if you're unsure.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>Can I skip lessons or sections?</h3>
          <p>
            Yes, you can navigate to any lesson at any time. However, we
            recommend following the curriculum in order, as later lessons build
            on concepts from earlier ones. Some sections are marked as required
            for completion tracking.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Technical Issues</h2>

        <div className={styles.faqItem}>
          <h3>My code won't run. What's wrong?</h3>
          <p>Common issues include:</p>
          <ul>
            <li>Syntax errors in your code - check the error message</li>
            <li>
              The Python environment is still loading - wait for the green
              indicator
            </li>
            <li>Browser compatibility - try a different browser</li>
            <li>JavaScript is disabled - enable it in your browser settings</li>
          </ul>
        </div>

        <div className={styles.faqItem}>
          <h3>How do I report a bug or issue?</h3>
          <p>
            <em>Thoughtful Coding</em> is open source! You can report issues on
            our{" "}
            <a
              href="https://github.com/thoughtful-coding/thoughtful-coding.github.io/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub issues page
            </a>
            . Please include details about what you were doing when the problem
            occurred and which browser you're using.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>For Teachers</h2>

        <div className={styles.faqItem}>
          <h3>
            Can I use <em>Thoughtful Coding</em> in my classroom?
          </h3>
          <p>
            Absolutely! <em>Thoughtful Coding</em> is designed for educational
            use. You can have your students use it anonymously or create
            accounts. The Teacher Portal provides tools for reviewing student
            submissions and providing feedback.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>Can I track student progress?</h3>
          <p>
            Yes! The Teacher Portal (accessible from the footer) allows
            instructors to view student PRIMM and Reflection submissions. Note
            that students must be signed in for their work to appear in the
            instructor dashboard.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>Can I add my own lessons?</h3>
          <p>
            Yes! <em>Thoughtful Coding</em> is open source and accepts
            contributions. You can add new lessons by following the contribution
            guidelines in our{" "}
            <a
              href="https://github.com/thoughtful-coding/thoughtful-coding.github.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub repository
            </a>
            . The CLAUDE.md file provides detailed instructions on adding
            lessons.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Privacy and Data</h2>

        <div className={styles.faqItem}>
          <h3>What data do you collect?</h3>
          <p>
            For anonymous users, we collect nothing - all data stays in your
            browser. For authenticated users, we store your Google account info
            (name, email), learning progress, and code submissions. See our{" "}
            <a href="/privacy-policy">Privacy Policy</a> for complete details.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>Can I delete my account?</h3>
          <p>
            Yes. Contact us through our{" "}
            <a
              href="https://eric-rizzi.github.io/teaching/"
              target="_blank"
              rel="noopener noreferrer"
            >
              About Us
            </a>{" "}
            page to request account deletion. Your data will be permanently
            removed from our servers.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>Is my code secure?</h3>
          <p>
            Your code runs entirely in your browser - it never leaves your
            computer during execution. Only PRIMM and Reflection submissions are
            sent to our servers for AI evaluation. All data transmission is
            encrypted using HTTPS.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Still Have Questions?</h2>
        <p>
          If your question isn't answered here, feel free to reach out through
          our{" "}
          <a
            href="https://eric-rizzi.github.io/teaching/"
            target="_blank"
            rel="noopener noreferrer"
          >
            About Us
          </a>{" "}
          page or open an issue on{" "}
          <a
            href="https://github.com/thoughtful-coding/thoughtful-coding.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default FAQPage;
