# Deployment to GitHub Pages

This document provides instructions on how to deploy your Answer Checker React app to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Git installed on your machine
3. Your project code (which you already have)

## Steps to Deploy

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in to your account
2. Click the "New" button to create a new repository
3. Name your repository `answer-checker-react` (this name must match the base path in your `vite.config.js`)
4. Make the repository public (required for GitHub Pages)
5. Do NOT initialize with a README, .gitignore, or license
6. Click "Create repository"

### 2. Push Your Code to GitHub

If you haven't already initialized your local repository, run these commands in your project directory:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/answer-checker-react.git
git push -u origin main
```

Replace `your-username` with your actual GitHub username.

If you've already set up your repository, just ensure your latest changes are pushed:

```bash
git add .
git commit -m "Add deployment configuration"
git push
```

### 3. Deploy to GitHub Pages

To deploy your app to GitHub Pages, run:

```bash
npm run deploy
```

This command will:

1. Build your app for production (using the `predeploy` script)
2. Deploy the built files to the `gh-pages` branch of your repository

### 4. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to the "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Select "gh-pages" branch and "/ (root)" folder
6. Click "Save"

### 5. View Your Deployed App

After a few minutes, your app will be available at:
`https://your-username.github.io/answer-checker-react/`

Replace `your-username` with your actual GitHub username.

## Important Notes

- The base path in `vite.config.js` is set to `/answer-checker-react/` to match the repository name
- If you change your repository name, you must update the base path in `vite.config.js` accordingly
- It may take a few minutes for your site to be available after the first deployment
- Subsequent deployments can be done simply by running `npm run deploy` again
