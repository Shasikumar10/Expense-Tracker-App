import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { Platform } from 'react-native';
import { updateUserProfile, deleteUserAccount } from '../services/userService';
import { getExpenses } from '../services/expenseService';
import { getIncomes } from '../services/incomeService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const { user, logout, updateUser } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [currency, setCurrency] = useState(user?.currency || 'USD');
  const [theme, setTheme] = useState('light');
  const [saving, setSaving] = useState(false);

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'];
  const themes = ['light', 'dark', 'auto'];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem('notifications');
      const savedEmailNotifications = await AsyncStorage.getItem('emailNotifications');
      const savedBiometric = await AsyncStorage.getItem('biometric');
      const savedTheme = await AsyncStorage.getItem('theme');

      if (savedNotifications !== null) setNotifications(savedNotifications === 'true');
      if (savedEmailNotifications !== null) setEmailNotifications(savedEmailNotifications === 'true');
      if (savedBiometric !== null) setBiometric(savedBiometric === 'true');
      if (savedTheme !== null) setTheme(savedTheme);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);

      // Save currency to backend
      if (currency !== user?.currency) {
        const response = await updateUserProfile({ currency });
        if (response.success && updateUser) {
          updateUser({ ...user, currency });
        }
      }

      // Save other settings to AsyncStorage
      await AsyncStorage.setItem('notifications', notifications.toString());
      await AsyncStorage.setItem('emailNotifications', emailNotifications.toString());
      await AsyncStorage.setItem('biometric', biometric.toString());
      await AsyncStorage.setItem('theme', theme);

      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      Alert.alert(
        'Export Data',
        'Choose export format:',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'CSV',
            onPress: () => exportToCSV(),
          },
          {
            text: 'JSON',
            onPress: () => exportToJSON(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
      console.error('Export error:', error);
    }
  };

  const exportToCSV = async () => {
    try {
      const [expensesData, incomesData] = await Promise.all([
        getExpenses(),
        getIncomes(),
      ]);

      const expenses = expensesData.data || [];
      const incomes = incomesData.data || [];

      // Create CSV content
      let csvContent = 'Type,Date,Amount,Category,Description,Payment Method\n';
      
      expenses.forEach((expense) => {
        const date = new Date(expense.date).toLocaleDateString();
        csvContent += `Expense,${date},${expense.amount},${expense.category},"${expense.description}",${expense.paymentMethod}\n`;
      });

      incomes.forEach((income) => {
        const date = new Date(income.date).toLocaleDateString();
        csvContent += `Income,${date},${income.amount},${income.category},"${income.description}",${income.source || 'N/A'}\n`;
      });

      const fileName = `expense_tracker_${new Date().getTime()}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Success', `Data exported to ${fileName}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export CSV');
      console.error('CSV export error:', error);
    }
  };

  const exportToJSON = async () => {
    try {
      const [expensesData, incomesData] = await Promise.all([
        getExpenses(),
        getIncomes(),
      ]);

      const exportData = {
        expenses: expensesData.data || [],
        incomes: incomesData.data || [],
        exportDate: new Date().toISOString(),
        user: {
          name: user?.name,
          email: user?.email,
          currency: user?.currency,
        },
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const fileName = `expense_tracker_${new Date().getTime()}.json`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, jsonContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Success', `Data exported to ${fileName}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export JSON');
      console.error('JSON export error:', error);
    }
  };

  const handleClearCache = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Success', 'Cache cleared successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear cache');
      console.error('Clear cache error:', error);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserAccount();
              Alert.alert(
                'Account Deleted',
                'Your account has been permanently deleted.',
                [{ text: 'OK', onPress: logout }]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account');
              console.error('Delete account error:', error);
            }
          },
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, rightComponent }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={COLORS.primary} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <SettingItem
              icon="notifications-outline"
              title="Push Notifications"
              subtitle="Receive expense and budget alerts"
              rightComponent={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              }
            />
            <SettingItem
              icon="mail-outline"
              title="Email Notifications"
              subtitle="Get weekly expense reports"
              rightComponent={
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              }
            />
          </View>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.card}>
            <SettingItem
              icon="finger-print-outline"
              title="Biometric Login"
              subtitle="Use fingerprint or Face ID"
              rightComponent={
                <Switch
                  value={biometric}
                  onValueChange={setBiometric}
                  trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              }
            />
            <TouchableOpacity 
              style={styles.settingButton}
              onPress={() => navigation.navigate('ChangePassword')}
            >
              <SettingItem
                icon="key-outline"
                title="Change Password"
                subtitle="Update your password"
                rightComponent={
                  <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="cash-outline" size={24} color={COLORS.primary} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Currency</Text>
                  <Text style={styles.settingSubtitle}>Default currency for expenses</Text>
                </View>
              </View>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={currency}
                onValueChange={(itemValue) => setCurrency(itemValue)}
                style={styles.picker}
                itemStyle={Platform.OS === 'ios' ? styles.pickerItem : undefined}
              >
                {currencies.map((curr) => (
                  <Picker.Item key={curr} label={curr} value={curr} />
                ))}
              </Picker>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="color-palette-outline" size={24} color={COLORS.primary} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Theme</Text>
                  <Text style={styles.settingSubtitle}>App appearance</Text>
                </View>
              </View>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={theme}
                onValueChange={(itemValue) => setTheme(itemValue)}
                style={styles.picker}
                itemStyle={Platform.OS === 'ios' ? styles.pickerItem : undefined}
              >
                {themes.map((t) => (
                  <Picker.Item 
                    key={t} 
                    label={t.charAt(0).toUpperCase() + t.slice(1)} 
                    value={t} 
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.settingButton}
              onPress={handleExportData}
            >
              <SettingItem
                icon="download-outline"
                title="Export Data"
                subtitle="Download your expense data"
                rightComponent={
                  <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
                }
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.settingButton}
              onPress={() => {
                Alert.alert(
                  'Clear Cache',
                  'This will clear all cached data. Continue?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Clear', onPress: handleClearCache }
                  ]
                );
              }}
            >
              <SettingItem
                icon="trash-outline"
                title="Clear Cache"
                subtitle="Free up storage space"
                rightComponent={
                  <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.settingButton}
              onPress={handleDeleteAccount}
            >
              <SettingItem
                icon="warning-outline"
                title="Delete Account"
                subtitle="Permanently delete your account"
                rightComponent={
                  <Ionicons name="chevron-forward" size={24} color={COLORS.danger} />
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSaveSettings}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color={COLORS.white} />
              <Text style={styles.saveButtonText}>Save Settings</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  settingButton: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pickerContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  picker: {
    height: Platform.OS === 'ios' ? 120 : 50,
    width: '100%',
  },
  pickerItem: {
    height: 120,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default SettingsScreen;
