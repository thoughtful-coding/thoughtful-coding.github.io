#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const dataDir = path.join(rootDir, "courses");
const coursesFile = path.join(rootDir, "courses/courses.ts");

// Determine if this is a production build (default to development if not set)
const isProduction = process.env.NODE_ENV === "production";

console.log(
  `\n🔧 Fetching courses (${isProduction ? "PRODUCTION" : "DEVELOPMENT"} mode)...\n`
);

/**
 * Simple TypeScript parser to extract course sources from courses.ts
 * This avoids needing a TypeScript runtime like tsx
 */
function parseCourseSources() {
  const content = fs.readFileSync(coursesFile, "utf-8");

  // Extract the courseSources array using regex
  const match = content.match(
    /const courseSources:\s*CourseSource\[\]\s*=\s*(\[[\s\S]*?\]);/
  );

  if (!match) {
    throw new Error("Could not find courseSources array in courses.ts");
  }

  let arrayContent = match[1];

  // Remove single-line comments
  arrayContent = arrayContent.replace(/\/\/.*$/gm, "");

  // Remove multi-line comments
  arrayContent = arrayContent.replace(/\/\*[\s\S]*?\*\//g, "");

  // Parse the array - this is a simple parser that handles the specific format
  // For production use, consider using a proper TypeScript parser
  const sources = [];
  const objectMatches = arrayContent.matchAll(/\{[^}]+\}/g);

  for (const objMatch of objectMatches) {
    const obj = objMatch[0];

    // Extract properties
    const typeMatch = obj.match(/type:\s*"([^"]+)"/);
    const directoryMatch = obj.match(/directory:\s*"([^"]+)"/);
    const devOnlyMatch = obj.match(/devOnly:\s*(true|false)/);
    const repoMatch = obj.match(/repo:\s*"([^"]+)"/);
    const refMatch = obj.match(/ref:\s*"([^"]+)"/);

    if (!typeMatch || !directoryMatch) {
      console.warn("Skipping malformed course entry:", obj);
      continue;
    }

    const source = {
      type: typeMatch[1],
      directory: directoryMatch[1],
    };

    if (devOnlyMatch) {
      source.devOnly = devOnlyMatch[1] === "true";
    }

    if (repoMatch) {
      source.repo = repoMatch[1];
    }

    if (refMatch) {
      source.ref = refMatch[1];
    }

    sources.push(source);
  }

  return sources;
}

async function fetchCourses() {
  try {
    // Parse course sources from TypeScript file
    const courseSources = parseCourseSources();

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
