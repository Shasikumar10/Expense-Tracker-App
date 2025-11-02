import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createBudget } from '../services/budgetService';
import { EXPENSE_CATEGORIES, BUDGET_PERIODS, COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';

const AddBudgetScreen = ({ navigation }) => {
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('monthly');
  const [alertThreshold, setAlertThreshold] = useState('80');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getCurrencySymbol = () => {
    const currency = user?.currency || 'USD';
    const symbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥', AUD: 'A$', CAD: 'C$' };
    return symbols[currency] || '$';
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!alertThreshold || parseFloat(alertThreshold) < 0 || parseFloat(alertThreshold) > 100) {
      Alert.alert('Error', 'Alert threshold must be between 0 and 100');
      return;
    }

    try {
      setLoading(true);
      const response = await createBudget({
        category,
        amount: parseFloat(amount),
        period,
        alertThreshold: parseFloat(alertThreshold),
      });

      if (response.success) {
        Alert.alert('Success', 'Budget created successfully');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
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
          <Text style={styles.label}>Budget Amount</Text>
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
          <Text style={styles.label}>Period</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={period}
              onValueChange={setPeriod}
              style={styles.picker}
            >
              {BUDGET_PERIODS.map((p) => (
                <Picker.Item key={p} label={p.charAt(0).toUpperCase() + p.slice(1)} value={p} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Alert Threshold (%)</Text>
          <TextInput
            style={styles.input}
            value={alertThreshold}
            onChangeText={setAlertThreshold}
            placeholder="80"
            keyboardType="decimal-pad"
            placeholderTextColor={COLORS.textSecondary}
          />
          <Text style={styles.helperText}>
            You'll be notified when spending reaches this percentage
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Budget Summary</Text>
          <Text style={styles.infoText}>
            You'll be able to spend{' '}
            <Text style={styles.infoHighlight}>
              {getCurrencySymbol()}{amount || '0'} {period}
            </Text>{' '}
            on {category} expenses.
          </Text>
          <Text style={styles.infoText}>
            Alert when spending reaches{' '}
            <Text style={styles.infoHighlight}>
              {getCurrencySymbol()}{((parseFloat(amount) || 0) * (parseFloat(alertThreshold) || 80) / 100).toFixed(2)}
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating...' : 'Create Budget'}
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
  helperText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 5,
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

export default AddBudgetScreen;
