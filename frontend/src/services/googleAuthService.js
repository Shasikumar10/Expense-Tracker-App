import * as WebBrowser from 'expo-web-browser';
import { Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants';

WebBrowser.maybeCompleteAuthSession();

export const signInWithGoogle = async () => {
  try {
    // Open the Google OAuth URL in a browser
    const authUrl = `${API_URL}/auth/google`;
    
    const result = await WebBrowser.openAuthSessionAsync(
      authUrl,
      'exp://192.168.1.9:8081'
    );

    if (result.type === 'success') {
      // Parse the URL to get token and user data
      const url = result.url;
      const params = new URLSearchParams(url.split('?')[1]);
      const token = params.get('token');
      const userStr = params.get('user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        
        // Store token and user data
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        return {
          success: true,
          data: {
            ...user,
            token
          }
        };
      }
    }

    return {
      success: false,
      message: 'Authentication was cancelled or failed'
    };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to sign in with Google'
    };
  }
};

// Alternative method using deep linking (if WebBrowser doesn't work)
export const signInWithGoogleDeepLink = async () => {
  try {
    const authUrl = `${API_URL}/auth/google`;
    
    // Open in external browser
    const supported = await Linking.canOpenURL(authUrl);
    
    if (supported) {
      await Linking.openURL(authUrl);
      
      return {
        success: true,
        message: 'Please complete authentication in browser'
      };
    } else {
      return {
        success: false,
        message: 'Cannot open authentication URL'
      };
    }
  } catch (error) {
    console.error('Google Sign-In Deep Link Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to open authentication'
    };
  }
};
