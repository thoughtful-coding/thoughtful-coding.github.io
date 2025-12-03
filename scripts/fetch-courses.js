#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const dataDir = path.join(rootDir, "courses");
const coursesFile = path.join(rootDir, "courses/courses.json");

// Determine if this is a production build (default to development if not set)
const isProduction = process.env.NODE_ENV === "production";

console.log(
  `\n🔧 Fetching courses (${isProduction ? "PRODUCTION" : "DEVELOPMENT"} mode)...\n`
);

/**
 * Load course sources from JSON file
 */
function loadCourseSources() {
  const content = fs.readFileSync(coursesFile, "utf-8");
  return JSON.parse(content);
}

async function fetchCourses() {
  try {
    // Load course sources from JSON file
    const courseSources = loadCourseSources();

    console.log(`Found ${courseSources.length} course(s) in configuration\n`);

    for (const source of courseSources) {
      const courseDir = path.join(dataDir, source.directory);

      // Skip validation of devOnly courses in production
      // (They'll be removed from dist after Vite build)
      if (isProduction && source.devOnly) {
        console.log(`⏭️  Skipping dev-only course: ${source.directory}`);
        console.log(
          `   (Will be excluded from production build)\n`
        );
        continue;
      }

      // Handle git courses
      if (source.type === "git") {
        // Check if directory already exists (local development scenario)
        if (fs.existsSync(courseDir)) {
          console.log(
            `✓ Course already exists (local dev): ${source.directory}`
          );
          console.log(`   Using existing clone at: ${courseDir}\n`);
          continue;
        }

        // Clone the repository
        console.log(`📦 Fetching git course: ${source.directory}`);
        console.log(`   Repo: ${source.repo}`);
        console.log(`   Ref: ${source.ref}`);

        try {
          // Clone with specific ref
          execSync(
            `git clone --depth 1 --branch ${source.ref} ${source.repo} "${courseDir}"`,
            { stdio: "inherit" }
          );
          console.log(`✓ Successfully cloned: ${source.directory}\n`);
        } catch (error) {
          console.error(`❌ Failed to clone course: ${source.directory}`);
          console.error(`   Error: ${error.message}`);
          process.exit(1);
        }
      } else if (source.type === "local") {
        // Local course - just verify it exists
        if (!fs.existsSync(courseDir)) {
          console.error(`❌ Local course not found: ${source.directory}`);
          console.error(`   Expected at: ${courseDir}`);
          process.exit(1);
        }
        console.log(`✓ Local course found: ${source.directory}\n`);
      } else {
        console.warn(`⚠️  Unknown course type: ${source.type}\n`);
      }
    }

    console.log("✅ All courses ready!\n");
  } catch (error) {
    console.error("❌ Error fetching courses:", error.message);
    process.exit(1);
  }
}

fetchCourses();
