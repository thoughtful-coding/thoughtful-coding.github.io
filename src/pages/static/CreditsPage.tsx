import React from "react";
import styles from "./StaticPage.module.css";

const CreditsPage: React.FC = () => {
  return (
    <div className={styles.staticPageContainer}>
      <h1>Credits</h1>

      <section className={styles.section}>
        <h2>Inspiration</h2>

        <div className={styles.faqItem}>
          <h3>Science of Learning</h3>
          <p>
            The pedagogical framing of this site draws from{" "}
            <a
              href="https://doi.org/10.1177/0098628318762997"
              target="_blank"
              rel="noopener noreferrer"
            >
              <em>Teaching the Science of Learning</em>
            </a>{" "}
            by Yana Weinstein, Christopher R. Madan, and Megan A. Sumeracki.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>PRIMM</h3>
          <p>
            The PRIMM (Predict, Run, Investigate, Modify, Make) pedagogy used
            throughout this platform was developed by{" "}
            <a
              href="https://primmportal.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sue Sentance, Jane Waite, and others
            </a>
            .
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>Learning Entries</h3>
          <p>
            The learning journal feature that has students record what they
            learned was inspired by Josh Branchaud's{" "}
            <a
              href="https://github.com/jbranchaud/til"
              target="_blank"
              rel="noopener noreferrer"
            >
              "Today I Learned"
            </a>{" "}
            project.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>Debugger</h3>
          <p>
            The Debugger section where students step through code execution was
            inspired by{" "}
            <a
              href="https://pythontutor.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Python Tutor
            </a>{" "}
            (CodeLens) by Philip Guo.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>RefactorSection</h3>
          <p>
            The Refactor section type that has students rewrite a program in
            multiple styles was inspired by the SixHack project by{" "}
            <a
              href="https://httcs.online"
              target="_blank"
              rel="noopener noreferrer"
            >
              Alan Harrison
            </a>
            .
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>Brick Wall Activity</h3>
          <p>
            The{" "}
            <a href="/intro-python/lesson/04_functions_advanced/lessons/04_drawing_walls">
              brick wall drawing activity
            </a>{" "}
            was inspired by{" "}
            <a
              href="https://cs10.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Berkeley's CS10
            </a>{" "}
            course.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Acknowledgments</h2>

        <div className={styles.faqItem}>
          <p>
            Thank you to{" "}
            <a
              href="https://ieeexplore.ieee.org/author/37086254423"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mitchell Gerrard
            </a>{" "}
            for his consistent feedback, close reading, and various ideas
            throughout.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Technology</h2>

        <div className={styles.faqItem}>
          <h3>Pyodide</h3>
          <p>
            Python code execution in the browser is powered by{" "}
            <a
              href="https://pyodide.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pyodide
            </a>
            , a port of CPython to WebAssembly.
          </p>
        </div>
      </section>
    </div>
  );
};

export default CreditsPage;
