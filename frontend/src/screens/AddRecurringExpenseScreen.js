import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createRecurringExpense } from '../services/recurringExpenseService';
import { EXPENSE_CATEGORIES, FREQUENCIES, PAYMENT_METHODS, COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';

const AddRecurringExpenseScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [frequency, setFrequency] = useState('monthly');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [autoCreate, setAutoCreate] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderDays, setReminderDays] = useState('1');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getCurrencySymbol = () => {
    const currency = user?.currency || 'USD';
    const symbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥', AUD: 'A$', CAD: 'C$' };
    return symbols[currency] || '$';
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (reminderEnabled && (!reminderDays || parseInt(reminderDays) < 0)) {
      Alert.alert('Error', 'Please enter valid reminder days');
      return;
    }

    try {
      setLoading(true);
      const recurringExpenseData = {
        description: description.trim(),
        amount: parseFloat(amount),
        category,
        frequency,
        startDate: startDate.toISOString(),
        paymentMethod,
        autoCreate,
        reminderEnabled,
      };

      if (reminderEnabled) {
        recurringExpenseData.reminderDays = parseInt(reminderDays);
      }

      const response = await createRecurringExpense(recurringExpenseData);

      if (response.success) {
        Alert.alert('Success', 'Recurring expense created successfully');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create recurring expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="e.g., Netflix Subscription, Rent"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount *</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>{getCurrencySymbol()}</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={setCategory}
              style={styles.picker}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Frequency</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={frequency}
              onValueChange={setFrequency}
              style={styles.picker}
            >
              {FREQUENCIES.map((freq) => (
                <Picker.Item 
                  key={freq} 
                  label={freq.charAt(0).toUpperCase() + freq.slice(1)} 
                  value={freq} 
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Start Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{startDate.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Payment Method</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={paymentMethod}
              onValueChange={setPaymentMethod}
              style={styles.picker}
            >
              {PAYMENT_METHODS.map((method) => (
                <Picker.Item key={method} label={method} value={method} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.switchGroup}>
          <View style={styles.switchLeft}>
            <Text style={styles.label}>Auto-create Expenses</Text>
            <Text style={styles.helperText}>
              Automatically create expenses when due
            </Text>
          </View>
          <Switch
            value={autoCreate}
            onValueChange={setAutoCreate}
            trackColor={{ false: COLORS.light, true: COLORS.success + '40' }}
            thumbColor={autoCreate ? COLORS.success : COLORS.gray}
          />
        </View>

        <View style={styles.switchGroup}>
          <View style={styles.switchLeft}>
            <Text style={styles.label}>Enable Reminders</Text>
            <Text style={styles.helperText}>
              Get notified before expense is due
            </Text>
          </View>
          <Switch
            value={reminderEnabled}
            onValueChange={setReminderEnabled}
            trackColor={{ false: COLORS.light, true: COLORS.warning + '40' }}
            thumbColor={reminderEnabled ? COLORS.warning : COLORS.gray}
          />
        </View>

        {reminderEnabled && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reminder Days Before</Text>
            <TextInput
              style={styles.input}
              value={reminderDays}
              onChangeText={setReminderDays}
              placeholder="1"
              keyboardType="number-pad"
              placeholderTextColor={COLORS.textSecondary}
            />
            <Text style={styles.helperText}>
              You'll be reminded {reminderDays || '1'} day(s) before the expense is due
            </Text>
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Summary</Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoHighlight}>{getCurrencySymbol()}{amount || '0'}</Text>
            {' '}will be charged {frequency} starting{' '}
            {startDate.toLocaleDateString()}
          </Text>
          {autoCreate && (
            <Text style={styles.infoText}>
              ✓ Expenses will be created automatically
            </Text>
          )}
          {reminderEnabled && (
            <Text style={styles.infoText}>
              ✓ Reminders {reminderDays || '1'} day(s) before due date
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating...' : 'Create Recurring Expense'}
          </Text>
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingLeft: 15,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: 8,
  },
  pickerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  dateButton: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.text,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  switchLeft: {
    flex: 1,
    marginRight: 15,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  infoBox: {
    backgroundColor: COLORS.lightBlue,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 5,
  },
  infoHighlight: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddRecurringExpenseScreen;
