# Deployment Configuration Guide

This guide helps you configure the Thoughtful Python platform for your own deployment, whether you're forking the project or setting up a new instance.

## Quick Configuration Checklist

### 1. Frontend Base Path (`vite.config.ts`)

**For organization repos named `<org>.github.io`:**
```typescript
export default defineConfig({
  base: "/", // Serves from root domain
  // ... rest of config
});
```

**For project repos (not named `<org>.github.io`):**
```typescript
export default defineConfig({
  base: "/repo-name/", // Change to your repo name
  // ... rest of config
});
```

**Example:**
- `thoughtful-coding.github.io` repo → `base: "/"`
- `your-org/python-lessons` repo → `base: "/python-lessons/"`

### 2. Frontend Configuration (`src/config.ts`)

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

### 3. GitHub Repository Settings

**Step 1: Enable GitHub Pages**
1. Go to your repository → Settings → Pages
2. Under "Source", select "GitHub Actions"
3. Save

**Step 2: Set Repository Permissions**
1. Go to Settings → Actions → General
2. Under "Workflow permissions", enable:
   - "Read and write permissions"
   - "Allow GitHub Actions to create and approve pull requests"

**Your site will be available at:**
- `https://<username>.github.io/<repo-name>/` (user account)
- `https://<org-name>.github.io/<repo-name>/` (organization account)

### 4. Google OAuth Configuration

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

### 5. Backend Configuration

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
| `vite.config.ts` | `base` | `"/"` (for `<org>.github.io` repos) or `"/repo-name/"` (for project repos) |
| `src/config.ts` | `API_GATEWAY_BASE_URL` | `"https://xyz.execute-api.us-west-1.amazonaws.com/"` |
| `src/config.ts` | `GOOGLE_CLIENT_ID` | `"123456789-abc.apps.googleusercontent.com"` |
| Google OAuth | Authorized Origins | `https://your-username.github.io` |
| Google OAuth | Redirect URIs | `https://your-username.github.io/python/` |
| Backend CORS | Allowed Origins | `https://your-username.github.io` |

---

## Environment-Specific Configuration

### Development (localhost)
- Runs on `http://localhost:5173/`
- Python curriculum: `http://localhost:5173/python/`
- Root redirects to `/python/`
- OAuth redirect: `http://localhost:5173/python/`

### Production (GitHub Pages - Organization Repo)
- Repo name: `<org>.github.io`
- Runs on `https://<org>.github.io/`
- Python curriculum: `https://<org>.github.io/python/`
- Base path: `/`
- OAuth redirect: `https://<org>.github.io/python/`

### Production (GitHub Pages - Project Repo)
- Repo name: `<any-name>`
- Runs on `https://<username>.github.io/<repo>/`
- Base path must match: `/<repo>/`
- OAuth redirect: `https://<username>.github.io/<repo>/`

---

## Troubleshooting

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

**Production URL:** `https://thoughtful-coding.github.io/python/`
- Root URL (`https://thoughtful-coding.github.io/`) redirects to `/python/`

**Architecture:**
- Single React app serving multiple curriculums
- Base path: `/` (root)
- Python curriculum: `/python/*` routes
- Future Scratch curriculum: `/scratch/*` routes (planned)

**Configuration:**
- API: AWS API Gateway (us-west-1)
- OAuth: Google OAuth 2.0

**External Links (keep these unchanged):**
- Teaching site: `https://eric-rizzi.github.io/teaching/`
