import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { Platform } from 'react-native';

const SettingsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [currency, setCurrency] = useState(user?.currency || 'USD');
  const [theme, setTheme] = useState('light');

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'];
  const themes = ['light', 'dark', 'auto'];

  const handleSaveSettings = () => {
    Alert.alert(
      'Success',
      'Settings saved successfully!',
      [{ text: 'OK' }]
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
                  value={true}
                  onValueChange={() => {}}
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
            <TouchableOpacity style={styles.settingButton}>
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
            <TouchableOpacity style={styles.settingButton}>
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
                    { text: 'Clear', onPress: () => Alert.alert('Success', 'Cache cleared!') }
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
              onPress={() => {
                Alert.alert(
                  'Delete Account',
                  'This action cannot be undone. All your data will be permanently deleted.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Delete', 
                      style: 'destructive',
                      onPress: () => Alert.alert('Info', 'Account deletion is not yet implemented')
                    }
                  ]
                );
              }}
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
          style={styles.saveButton}
          onPress={handleSaveSettings}
        >
          <Text style={styles.saveButtonText}>Save Settings</Text>
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
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
