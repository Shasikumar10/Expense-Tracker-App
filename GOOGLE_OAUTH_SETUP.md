# Google OAuth Setup Guide

## Prerequisites
- Google Cloud Platform account
- Your backend running on `http://192.168.1.9:5000`

## Steps to Enable Google Authentication

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "Expense Tracker" and click "Create"

### 2. Enable Google+ API
1. In the left sidebar, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Expense Tracker
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue"
   - Skip scopes (click "Save and Continue")
   - Add test users if needed
   - Click "Save and Continue"

4. Create OAuth Client ID:
   - Application type: Web application
   - Name: Expense Tracker Web Client
   - Authorized JavaScript origins:
     - `http://192.168.1.9:5000`
     - `http://localhost:5000`
   - Authorized redirect URIs:
     - `http://192.168.1.9:5000/api/auth/google/callback`
     - `http://localhost:5000/api/auth/google/callback`
   - Click "Create"

5. Copy the Client ID and Client Secret

### 4. Update Backend Configuration
1. Open `backend/.env` file
2. Replace the placeholder values:
   ```
   GOOGLE_CLIENT_ID=your-actual-client-id-from-step-3
   GOOGLE_CLIENT_SECRET=your-actual-client-secret-from-step-3
   ```

### 5. Restart Backend Server
```bash
cd backend
npm start
```

## Testing Google Authentication

### From Mobile App:
1. The "Continue with Google" button will open a browser
2. User selects their Google account
3. Grants permissions
4. Gets redirected back to the app with authentication token

### From Web Browser (Testing):
Visit: `http://192.168.1.9:5000/api/auth/google`

## Important Notes

- **Development Mode**: The OAuth consent screen will show "This app isn't verified" - this is normal during development
- **Production**: Before going to production, you'll need to verify your app with Google
- **Test Users**: In development, only test users added in the OAuth consent screen can authenticate
- **Expiry**: Access tokens expire after 1 hour, but our JWT tokens last 7 days

## Security Best Practices

1. Never commit `.env` file to version control
2. Use different credentials for development and production
3. Regularly rotate your client secrets
4. Limit the scopes to only what you need (profile, email)

## Troubleshooting

### "redirect_uri_mismatch" error
- Ensure the callback URL in Google Console matches exactly with your backend URL
- Check that you're using the correct IP address

### "Access blocked" error
- Add your email as a test user in OAuth consent screen
- Make sure Google+ API is enabled

### "Invalid client" error
- Verify Client ID and Client Secret are correct in .env
- Restart the backend server after updating .env

## Support
For issues, refer to:
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
