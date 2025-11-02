# Frontend Setup Guide (React Native Mobile App)

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo Go app on your mobile device (available on App Store and Google Play)
- OR Android Studio (for Android emulator)
- OR Xcode (for iOS simulator - Mac only)

## Installation Steps

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure API URL
Update the API URL in `src/constants/index.js` based on your setup:

```javascript
// For development with physical device
export const API_URL = 'http://YOUR_COMPUTER_IP:5000/api';
// Example: http://192.168.1.100:5000/api

// For Android emulator
export const API_URL = 'http://10.0.2.2:5000/api';

// For iOS simulator
export const API_URL = 'http://localhost:5000/api';
```

**Finding your computer's IP address:**
- Windows: Run `ipconfig` in command prompt, look for IPv4 Address
- Mac/Linux: Run `ifconfig` or `ip addr`, look for inet address

### 3. Start the Development Server
```bash
npx expo start
```

This will open Expo Dev Tools in your browser.

### 4. Run on Your Device

#### Option A: Physical Device (Recommended for beginners)
1. Install **Expo Go** app from App Store (iOS) or Google Play (Android)
2. Make sure your phone and computer are on the same WiFi network
3. Scan the QR code from the terminal or Expo Dev Tools using:
   - iPhone: Camera app
   - Android: Expo Go app

#### Option B: Android Emulator
1. Install Android Studio
2. Set up an Android Virtual Device (AVD)
3. Start the emulator
4. Press `a` in the terminal where Expo is running

#### Option C: iOS Simulator (Mac only)
1. Install Xcode from Mac App Store
2. Install Xcode Command Line Tools: `xcode-select --install`
3. Press `i` in the terminal where Expo is running

## App Features

### Authentication
- **Login Screen**: Sign in with email and password
- **Register Screen**: Create new account with name, email, password, and preferred currency

### Main Features
1. **Home Screen**: 
   - View all expenses
   - See total spending
   - Delete expenses with swipe gesture
   - Pull to refresh
   - Floating action button to add new expense

2. **Add Expense Screen**:
   - Enter expense details (title, amount, category)
   - Select date
   - Choose payment method
   - Add description

3. **Expense Details Screen**:
   - View complete expense information
   - Delete expense
   - See creation timestamp

4. **Statistics Screen**:
   - View total spending
   - See breakdown by category
   - Visual progress bars
   - Percentage distribution

5. **Profile Screen**:
   - View account information
   - Access settings
   - Logout functionality

## Troubleshooting

### Cannot Connect to Backend
1. Ensure backend server is running on `http://localhost:5000`
2. Check if API_URL in constants is correctly set
3. For physical device, verify same WiFi network
4. Disable any VPN that might interfere

### Expo Go App Not Loading
- Clear Expo cache: `npx expo start -c`
- Restart Expo server
- Restart Expo Go app
- Check if device and computer are on same network

### Android Emulator Issues
- Ensure virtualization is enabled in BIOS
- Allocate enough RAM to AVD (at least 2GB)
- Use `http://10.0.2.2:5000/api` as API_URL

### iOS Simulator Issues
- Ensure Xcode is properly installed
- Accept Xcode license: `sudo xcodebuild -license accept`
- Use `http://localhost:5000/api` as API_URL

### White Screen on Launch
- Check console for errors
- Verify all dependencies are installed
- Clear cache and restart: `npx expo start -c`

## Development Tips

### Hot Reload
- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android) to open developer menu
- Enable "Fast Refresh" for automatic updates

### Debugging
- Press `j` in terminal to open debugger in Chrome
- Use `console.log()` statements
- Check Expo Dev Tools for error logs

### Building for Production

#### Android APK
```bash
npx expo build:android
```

#### iOS IPA (requires Apple Developer account)
```bash
npx expo build:ios
```

## Project Structure
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/             # App screens
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── HomeScreen.js
│   │   ├── AddExpenseScreen.js
│   │   ├── ExpenseDetailScreen.js
│   │   ├── StatsScreen.js
│   │   └── ProfileScreen.js
│   ├── navigation/          # Navigation configuration
│   │   └── RootNavigator.js
│   ├── services/            # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── expenseService.js
│   ├── context/             # React Context
│   │   └── AuthContext.js
│   └── constants/           # App constants
│       └── index.js
├── assets/                  # Images and fonts
├── App.js                   # Entry point
└── package.json
```

## Technologies Used
- **React Native**: Mobile framework
- **Expo**: Development platform
- **React Navigation**: Navigation library
- **Axios**: HTTP client
- **AsyncStorage**: Local data persistence
- **React Context**: State management

## Available Scripts
- `npm start`: Start Expo development server
- `npm run android`: Run on Android
- `npm run ios`: Run on iOS
- `npm run web`: Run on web browser
