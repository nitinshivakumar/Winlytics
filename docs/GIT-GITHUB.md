# Commit and push Winlytics to GitHub

Your repo is already connected to **https://github.com/nitinshivakumar/Winlytics.git**.

## One-time (if not done)

1. **Git config** (if you haven’t):
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. **Auth**: Use either **HTTPS** (personal access token) or **SSH** (SSH key).  
   - HTTPS: when `git push` asks for password, use a [GitHub Personal Access Token](https://github.com/settings/tokens) (not your GitHub password).  
   - SSH: add your SSH key to GitHub and use the SSH remote:  
     `git remote set-url origin git@github.com:nitinshivakumar/Winlytics.git`

## Every time you want to save code to GitHub

From the **project root** (`/Users/nitin/Documents/Winlytics`):

```bash
# 1. See what changed
git status

# 2. Stage all changes (or add specific files)
git add .

# 3. Commit with a message
git commit -m "Your short description of the change"

# 4. Push to GitHub (branch: main)
git push -u origin main
```

**One-liner** (after editing the message):

```bash
git add . && git commit -m "Add CORS fix and email-first signup" && git push origin main
```

## Notes

- `.gitignore` already excludes `.venv/`, `node_modules/`, `.env`, `.env.local`, and `*.db`, so they won’t be committed.
- To push a different branch: `git push -u origin <branch-name>`.
- If push is rejected (e.g. remote has new commits), run `git pull --rebase origin main` then `git push origin main`.
