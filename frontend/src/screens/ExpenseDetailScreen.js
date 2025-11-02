import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getExpense, deleteExpense } from '../services/expenseService';
import { COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';

const ExpenseDetailScreen = ({ route, navigation }) => {
  const { expenseId } = route.params;
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchExpenseDetail();
  }, [expenseId]);

  const fetchExpenseDetail = async () => {
    try {
      const data = await getExpense(expenseId);
      if (data.success) {
        setExpense(data.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch expense details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expenseId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense');
            }
          },
        },
      ]
    );
  };

  const getCurrencySymbol = () => {
    const currency = user?.currency || 'USD';
    const symbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥', AUD: 'A$', CAD: 'C$' };
    return symbols[currency] || '$';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!expense) {
    return (
      <View style={styles.container}>
        <Text>Expense not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amount}>
            {getCurrencySymbol()}{expense.amount.toFixed(2)}
          </Text>
        </View>

        <View style={styles.detailCard}>
          <DetailRow 
            icon="pricetag-outline"
            label="Title"
            value={expense.title}
          />
          <DetailRow 
            icon="folder-outline"
            label="Category"
            value={expense.category}
          />
          <DetailRow 
            icon="calendar-outline"
            label="Date"
            value={new Date(expense.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          />
          <DetailRow 
            icon="card-outline"
            label="Payment Method"
            value={expense.paymentMethod}
          />
          {expense.description && (
            <DetailRow 
              icon="document-text-outline"
              label="Description"
              value={expense.description}
            />
          )}
          <DetailRow 
            icon="time-outline"
            label="Created"
            value={new Date(expense.createdAt).toLocaleString()}
          />
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.white} />
          <Text style={styles.deleteButtonText}>Delete Expense</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailIcon}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
    </View>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  amountContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 8,
  },
  amount: {
    color: COLORS.white,
    fontSize: 42,
    fontWeight: 'bold',
  },
  detailCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailIcon: {
    marginRight: 15,
    justifyContent: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ExpenseDetailScreen;
