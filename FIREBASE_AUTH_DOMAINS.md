# Firebase Auth Domain Configuration

## Issue Fixed

Fixed "Domain not allowlisted by project (auth/unauthorized-continue-uri)" error when sending email verification.

## Root Cause

Firebase Auth requires domains to be explicitly allowlisted for email verification continue URLs. Using `window.location.origin` (localhost) in development was causing the error.

## Solution Applied

Changed email verification continue URL to always use production domain:

```javascript
const continueUrl = "https://campuslostfound.vercel.app/login";
```

## Firebase Console Configuration Required

### 1. Go to Firebase Console

- Navigate to your project: `campusfoundlost`
- Go to **Authentication** > **Settings** > **Authorized domains**

### 2. Ensure These Domains Are Allowlisted

- `campuslostfound.vercel.app` ✅ (Production)
- `localhost` (for development testing if needed)
- Any other custom domains you plan to use

### 3. Verification Email Flow

1. User signs up → Email verification sent
2. User clicks email link → Redirects to `https://campuslostfound.vercel.app/login`
3. User logs in → Account is verified

## Development vs Production

- **Development**: Still uses production URL for email links (avoids domain issues)
- **Production**: Uses production URL for email links (works seamlessly)
- **Result**: Consistent experience, no unauthorized domain errors

## Files Modified

- `src/pages/Signup.jsx` - Updated `sendFirebaseEmailVerification` function

## Testing

- Signup process now works without "unauthorized-continue-uri" error
- Email verification links properly redirect to production login page
- Users can complete verification flow successfully
