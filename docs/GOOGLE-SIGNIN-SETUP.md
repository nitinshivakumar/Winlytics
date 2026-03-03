# Google Sign-In setup

To enable "Sign in with Google" on the login and signup pages:

## 1. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or pick an existing one).
3. Open **APIs & Services** → **Credentials**.
4. Click **Create Credentials** → **OAuth client ID**.
5. If asked, set **Application type** to **Web application**.
6. Add **Authorized JavaScript origins**:
   - `http://localhost:3000` (local)
   - Your production URL when you deploy (e.g. `https://your-app.vercel.app`).
7. Click **Create** and copy the **Client ID** (looks like `xxxx.apps.googleusercontent.com`).

## 2. Backend (.env)

In `backend/.env`:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

Restart the backend after changing `.env`.

## 3. Frontend (.env.local)

In `frontend/.env.local`:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

Use the **same** Client ID as in the backend. Restart the frontend (`npm run dev`) after adding this.

## 4. Test

- Open the app and go to **Sign up** or **Log in**.
- You should see a **Continue with Google** button.
- If the env vars are missing, the Google button is hidden and email/password still works.
