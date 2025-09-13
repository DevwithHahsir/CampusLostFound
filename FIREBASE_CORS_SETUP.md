# Firebase Storage CORS Configuration Guide

## Issue

The Campus Lost & Found app is experiencing CORS (Cross-Origin Resource Sharing) errors when trying to upload images to Firebase Storage from localhost:5173 during development.

## Error Message

```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

## Solution

### Method 1: Configure Firebase Storage CORS (Recommended)

1. **Install Firebase CLI** (if not already installed):

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:

   ```bash
   firebase login
   ```

3. **Set Firebase project**:

   ```bash
   firebase use campusfoundlost
   ```

4. **Apply CORS configuration**:

   ```bash
   gsutil cors set cors.json gs://campusfoundlost.firebasestorage.app
   ```

   If you don't have gsutil installed, use:

   ```bash
   firebase storage:rules:deploy
   ```

### Method 2: Alternative Development Approaches

#### Option A: Use Firebase Emulator (Development Only)

```bash
firebase init emulators
firebase emulators:start --only storage
```

Then update your Firebase config to use the emulator in development.

#### Option B: Disable CORS in Browser (Development Only - NOT RECOMMENDED)

```bash
# Chrome with disabled security (Windows)
chrome.exe --user-data-dir=/tmp/foo --disable-web-security --disable-features=VizDisplayCompositor
```

### Method 3: Environment-Specific Configuration

The app now includes:

- `.env.local` for development
- Improved error handling in upload function
- Fallback options when upload fails

## Files Created/Modified

1. **cors.json** - CORS configuration for Firebase Storage
2. **.env.local** - Development environment variables
3. **ReportItemForm.jsx** - Enhanced upload function with CORS error handling

## Testing the Fix

1. Run the development server:

   ```bash
   npm run dev
   ```

2. Try uploading an image in the report form

3. Check browser console for detailed error messages

## Fallback Behavior

If image upload fails due to CORS:

- User gets a clear error message
- Option to submit form without image
- Option to retry the upload
- All other form data is preserved

## Production Deployment

CORS issues only affect localhost development. Production deployment on Vercel/Netlify will work normally as the domain is properly configured.

## Additional Notes

- The app compresses images before upload (60% quality, max 800px)
- Upload progress is now more accurate and responsive
- Better error messages help identify specific issues
- Form validation ensures required fields are completed

## Support

If CORS issues persist:

1. Check Firebase project permissions
2. Verify storage bucket name in configuration
3. Ensure Firebase CLI is properly authenticated
4. Contact Firebase support for storage bucket CORS configuration
