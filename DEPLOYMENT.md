# Deployment Configuration Guide

This guide helps you configure the Thoughtful Coding platform for your own deployment, whether you're forking the project or setting up a new instance.

## Architecture Overview

The platform supports multiple courses in a single deployment:
- **Course configuration**: `courses/courses.json` lists all courses
- **Local courses**: Stored in `courses/` directory, tracked in git
- **Git-based courses**: Cloned from external repositories during build
- **Course filtering**: Dev-only courses excluded from production builds

## Quick Configuration Checklist

### 1. Course Configuration (`courses/courses.json`)

Configure which courses to include in your deployment:

```json
[
  {
    "type": "local",
    "directory": "science-of-learning"
  },
  {
    "type": "git",
    "directory": "thoughtful-python",
    "repo": "https://github.com/thoughtful-coding/thoughtful-python.git",
    "ref": "main"
  },
  {
    "type": "local",
    "directory": "end-to-end-tests",
    "devOnly": true
  }
]
```

**Course Types:**
- **Local courses**: Stored in `courses/<directory>/`, tracked in your git repo
- **Git courses**: Cloned from external repos during build (use HTTPS URLs)
- **devOnly flag**: If `true`, excluded from production builds (useful for test courses)

**To add your own course:**
1. For local: Create folder in `courses/`, add entry to `courses.json`
2. For git-based: Add entry with repo URL and ref (branch/tag/commit)

### 2. Frontend Base Path (`vite.config.ts`)

**For organization repos named `<org>.github.io`:**
```typescript
export default defineConfig({
  base: "/", // Serves from root domain
});
```

**For project repos (not named `<org>.github.io`):**
```typescript
export default defineConfig({
  base: "/repo-name/", // Change to your repo name
});
```

**Example:**
- `thoughtful-coding.github.io` repo → `base: "/"`
- `your-org/coding-lessons` repo → `base: "/coding-lessons/"`

### 3. Frontend Configuration (`src/config.ts`)

Update these values for your deployment:

```typescript
// Base URL comes from Vite (don't change this line)
export const BASE_PATH = import.meta.env.BASE_URL;

// CHANGE THIS: Your API Gateway endpoint
export const API_GATEWAY_BASE_URL =
  "https://YOUR-API-ID.execute-api.YOUR-REGION.amazonaws.com/";

// CHANGE THIS: Your Google OAuth Client ID
export const GOOGLE_CLIENT_ID =
  "YOUR-CLIENT-ID.apps.googleusercontent.com";
```

### 4. GitHub Repository Settings

**⚠️ CRITICAL: Enable GitHub Pages with GitHub Actions**

This step is **required** for the site to deploy correctly. Without this, GitHub Pages will deploy raw source code instead of the built application.

**Step 1: Configure GitHub Pages Source**
1. Go to your repository → **Settings** → **Pages**
2. Under "Build and deployment", find **Source**
3. **Important:** Select **"GitHub Actions"** from the dropdown
4. Save

**Why this matters:**
- ❌ If set to "Deploy from a branch": GitHub Pages deploys raw source code
  - Git-based courses won't load (they're not in the repository)
  - Dev-only courses (like end-to-end-tests) will appear in production
  - The custom build workflow is ignored
- ✅ If set to "GitHub Actions": GitHub Pages uses your built artifact
  - Git-based courses are cloned and included during build
  - Dev-only courses are filtered out
  - The site works correctly

**Step 2: Set Repository Permissions**
1. Go to Settings → Actions → General
2. Under "Workflow permissions", enable:
   - "Read and write permissions"
   - "Allow GitHub Actions to create and approve pull requests"

**Your site will be available at:**
- `https://<username>.github.io/<repo-name>/` (user account)
- `https://<org-name>.github.io/<repo-name>/` (organization account)

### 5. Google OAuth Configuration

**Step 1: Create OAuth Credentials**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application

**Step 2: Configure Authorized Origins and Redirect URIs**

Add these to your OAuth client:

**Authorized JavaScript origins:**
- `https://<your-username>.github.io`
- `http://localhost:5173` (for local development)

**Authorized redirect URIs:**
- `https://<your-username>.github.io/<repo-name>/`
- `http://localhost:5173/` (for local development)

**Step 3: Update `src/config.ts`**
Copy your Client ID and update the `GOOGLE_CLIENT_ID` constant.

### 6. Backend Configuration

If you're using the backend API for progress tracking and AI features, you need to:

**Update CORS settings** in your backend to allow:
- `https://<your-username>.github.io`

**Update OAuth verification** to accept your Google Client ID.

**Update the frontend** `src/config.ts` with your API Gateway URL.

---

## Configuration Summary

Here's a quick reference of all values you need to change:

| File | Setting | Example Value |
|------|---------|---------------|
| `courses/courses.json` | Course list | Array of local/git course configs |
| `vite.config.ts` | `base` | `"/"` (for `<org>.github.io`) or `"/repo-name/"` (for project repos) |
| `src/config.ts` | `API_GATEWAY_BASE_URL` | `"https://xyz.execute-api.us-west-1.amazonaws.com/"` |
| `src/config.ts` | `GOOGLE_CLIENT_ID` | `"123456789-abc.apps.googleusercontent.com"` |
| Google OAuth | Authorized Origins | `https://your-username.github.io` |
| Google OAuth | Redirect URIs | `https://your-username.github.io/` or `https://your-username.github.io/repo-name/` |
| Backend CORS | Allowed Origins | `https://your-username.github.io` |
| GitHub Pages Settings | Source | **GitHub Actions** (not "Deploy from a branch") |

---

## Environment-Specific Configuration

### Development (localhost)
- Runs on `http://localhost:5173/`
- Homepage shows course selection
- Course URLs: `http://localhost:5173/unit/<course-id>`
- OAuth redirect: `http://localhost:5173/`
- Git courses: Must be cloned locally (see local development workflow)

### Production (GitHub Pages - Organization Repo)
- Repo name: `<org>.github.io`
- Runs on `https://<org>.github.io/`
- Base path: `/`
- OAuth redirect: `https://<org>.github.io/`
- Git courses: Cloned automatically during build

### Production (GitHub Pages - Project Repo)
- Repo name: `<any-name>`
- Runs on `https://<username>.github.io/<repo>/`
- Base path must match: `/<repo>/`
- OAuth redirect: `https://<username>.github.io/<repo>/`
- Git courses: Cloned automatically during build

---

## Local Development Workflow

### Working with Git-Based Courses

For local development with git-based courses:

1. **Clone the course repository locally:**
   ```bash
   cd courses
   git clone https://github.com/org/course-name course-directory
   ```

2. **The course directory must match the `directory` in `courses.json`:**
   ```json
   {
     "type": "git",
     "directory": "course-directory",  // ← Must match cloned folder name
     "repo": "https://github.com/org/course-name",
     "ref": "main"
   }
   ```

3. **Start dev server:**
   ```bash
   npm run dev
   ```
   Changes to the course will appear immediately.

4. **Commit and push changes to the course repo:**
   ```bash
   cd courses/course-directory
   git add .
   git commit -m "Update lesson"
   git push origin main
   ```

5. **The main repo ignores git-based course folders** (via `.gitignore`), so course changes stay in their own repository.

### Testing Production Builds Locally

To test what will be deployed:

```bash
# Build in production mode (filters devOnly courses)
NODE_ENV=production npm run build

# Preview the built site
npm run preview
```

---

## Troubleshooting

### Git-based courses not appearing or showing no lessons
**Symptom:** Course appears but has no lessons, or doesn't appear at all

**Causes:**
1. **GitHub Pages source set to "Deploy from a branch"** instead of "GitHub Actions"
   - Solution: Go to Settings → Pages → Source → Select "GitHub Actions"
2. **Git course failed to clone during build**
   - Check GitHub Actions logs for clone errors
   - Ensure repo URL uses HTTPS (not SSH): `https://github.com/...`
   - Verify the repository exists and is public

### Dev-only courses appearing in production
**Symptom:** Test courses (like end-to-end-tests) visible on deployed site

**Cause:** GitHub Pages source set to "Deploy from a branch" instead of "GitHub Actions"
- Solution: Settings → Pages → Source → "GitHub Actions"

### Local development: Git course missing
**Symptom:** Course not loading in dev server

**Solution:** Clone the course locally:
```bash
cd courses
git clone https://github.com/org/course-name course-directory-name
```

### 404 on GitHub Pages after deployment
- Check that `base` in `vite.config.ts` matches your repo name
- Ensure the workflow created `404.html` (check artifacts)

### OAuth not working
- Verify authorized origins and redirect URIs in Google Console match exactly
- Check browser console for specific OAuth errors
- Ensure your Client ID in `src/config.ts` is correct

### API calls failing
- Check `API_GATEWAY_BASE_URL` in `src/config.ts`
- Verify backend CORS allows your frontend domain
- Check browser console network tab for specific errors

### Changes not appearing on GitHub Pages
- GitHub Pages may cache for a few minutes
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check Actions tab to see if deployment succeeded

---

## Current Deployment (Reference)

**Production URL:** `https://thoughtful-coding.github.io/`

**Architecture:**
- Multi-course platform with course selection homepage
- Base path: `/` (root domain)
- Course URLs: `/unit/<course-id>`
- Courses configured in `courses/courses.json`

**Active Courses:**
- `science-of-learning` (local course)
- `thoughtful-python` (git-based course from separate repository)

**Configuration:**
- API: AWS API Gateway (us-west-1)
- OAuth: Google OAuth 2.0
- Build system: Vite with custom course fetching

**Course Management:**
- Local courses tracked in main repo under `courses/`
- Git-based courses cloned from external repos during build
- Dev-only courses filtered out in production builds
