import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  getRecurringExpenses,
  deleteRecurringExpense,
  getUpcomingRecurringExpenses,
  processDueRecurringExpenses,
} from '../services/recurringExpenseService';
import { COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';

const RecurringExpensesScreen = ({ navigation }) => {
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [upcomingExpenses, setUpcomingExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recurringData, upcomingData] = await Promise.all([
        getRecurringExpenses({ isActive: true }),
        getUpcomingRecurringExpenses({ days: 7 }),
      ]);

      if (recurringData.success) setRecurringExpenses(recurringData.data);
      if (upcomingData.success) setUpcomingExpenses(upcomingData.data);
    } catch (error) {
      console.error('Error fetching recurring expenses:', error);
      Alert.alert('Error', 'Failed to fetch recurring expenses');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleProcessDue = async () => {
    try {
      const response = await processDueRecurringExpenses();
      if (response.success) {
        Alert.alert(
          'Success',
          `Processed ${response.data.processed} recurring expense(s)`
        );
        fetchData();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process recurring expenses');
    }
  };

  const handleDelete = (id, description) => {
    Alert.alert(
      'Delete Recurring Expense',
      `Are you sure you want to delete "${description}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecurringExpense(id);
              fetchData();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete recurring expense');
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

  const getCategoryIcon = (category) => {
    const icons = {
      Food: 'fast-food',
      Transport: 'car',
      Shopping: 'cart',
      Entertainment: 'game-controller',
      Bills: 'receipt',
      Health: 'medical',
      Education: 'school',
      Travel: 'airplane',
      Other: 'ellipsis-horizontal',
    };
    return icons[category] || 'ellipsis-horizontal';
  };

  const getFrequencyIcon = (frequency) => {
    const icons = {
      daily: 'today',
      weekly: 'calendar',
      biweekly: 'calendar',
      monthly: 'calendar',
      quarterly: 'calendar',
      yearly: 'calendar',
    };
    return icons[frequency] || 'calendar';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntil = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  const renderRecurringItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: COLORS.primary + '20' }]}>
            <Ionicons name={getCategoryIcon(item.category)} size={24} color={COLORS.primary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item._id, item.description)}>
          <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>
            {getCurrencySymbol()}{item.amount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name={getFrequencyIcon(item.frequency)} size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>{item.frequency}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>{formatDate(item.nextDueDate)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.badges}>
          {item.autoCreate && (
            <View style={[styles.badge, { backgroundColor: COLORS.success + '20' }]}>
              <Text style={[styles.badgeText, { color: COLORS.success }]}>Auto-create</Text>
            </View>
          )}
          {item.reminderEnabled && (
            <View style={[styles.badge, { backgroundColor: COLORS.warning + '20' }]}>
              <Text style={[styles.badgeText, { color: COLORS.warning }]}>Reminder</Text>
            </View>
          )}
        </View>
        <Text style={styles.daysUntil}>{getDaysUntil(item.nextDueDate)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderUpcomingItem = ({ item }) => (
    <View style={styles.upcomingCard}>
      <View style={styles.upcomingLeft}>
        <Text style={styles.upcomingDesc}>{item.description}</Text>
        <Text style={styles.upcomingCategory}>{item.category}</Text>
      </View>
      <View style={styles.upcomingRight}>
        <Text style={styles.upcomingAmount}>
          {getCurrencySymbol()}{item.amount.toFixed(2)}
        </Text>
        <Text style={styles.upcomingDate}>{getDaysUntil(item.nextDueDate)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {upcomingExpenses.length > 0 && (
        <View style={styles.upcomingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming (Next 7 Days)</Text>
            <TouchableOpacity onPress={handleProcessDue} style={styles.processButton}>
              <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.processText}>Process Due</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={upcomingExpenses}
            renderItem={renderUpcomingItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.upcomingList}
          />
        </View>
      )}

      <View style={styles.mainSection}>
        <Text style={styles.mainTitle}>All Recurring Expenses</Text>
        {recurringExpenses.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="repeat-outline" size={80} color={COLORS.gray} />
            <Text style={styles.emptyText}>No recurring expenses</Text>
            <Text style={styles.emptySubtext}>Set up recurring expenses to automate tracking</Text>
          </View>
        ) : (
          <FlatList
            data={recurringExpenses}
            renderItem={renderRecurringItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddRecurringExpense')}
      >
        <Ionicons name="add" size={32} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  upcomingSection: {
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  processButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  processText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  upcomingList: {
    paddingHorizontal: 15,
  },
  upcomingCard: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    width: 150,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  upcomingLeft: {
    marginBottom: 8,
  },
  upcomingDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  upcomingCategory: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  upcomingRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upcomingAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.danger,
  },
  upcomingDate: {
    fontSize: 11,
    color: COLORS.warning,
    fontWeight: '600',
  },
  mainSection: {
    flex: 1,
    padding: 15,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  daysUntil: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default RecurringExpensesScreen;
