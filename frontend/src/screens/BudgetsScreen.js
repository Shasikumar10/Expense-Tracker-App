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
import { getBudgets, deleteBudget, getBudgetOverview } from '../services/budgetService';
import { COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';

const BudgetsScreen = ({ navigation }) => {
  const [budgets, setBudgets] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [budgetsData, overviewData] = await Promise.all([
        getBudgets({ isActive: true }),
        getBudgetOverview()
      ]);
      
      if (budgetsData.success) setBudgets(budgetsData.data);
      if (overviewData.success) setOverview(overviewData.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      Alert.alert('Error', 'Failed to fetch budgets');
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

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Budget',
      'Are you sure you want to delete this budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBudget(id);
              fetchData();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete budget');
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

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return COLORS.danger;
    if (percentage >= 80) return COLORS.warning;
    return COLORS.success;
  };

  const renderBudgetItem = ({ item }) => {
    const percentage = parseFloat(item.percentage);
    const progressColor = getProgressColor(percentage);

    return (
      <TouchableOpacity style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <Text style={styles.category}>{item.category}</Text>
          <TouchableOpacity onPress={() => handleDelete(item._id)}>
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.spent}>
            {getCurrencySymbol()}{item.spent.toFixed(2)}
          </Text>
          <Text style={styles.total}>
            of {getCurrencySymbol()}{item.amount.toFixed(2)}
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progress, 
              { 
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: progressColor
              }
            ]} 
          />
        </View>

        <View style={styles.budgetFooter}>
          <Text style={[styles.percentage, { color: progressColor }]}>
            {percentage.toFixed(1)}% used
          </Text>
          <Text style={styles.remaining}>
            {getCurrencySymbol()}{item.remaining.toFixed(2)} left
          </Text>
        </View>

        {item.alertTriggered && (
          <View style={styles.alertBadge}>
            <Ionicons name="warning" size={14} color={COLORS.white} />
            <Text style={styles.alertText}>Alert Triggered</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {overview && (
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Total Budget Overview</Text>
          <View style={styles.overviewRow}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Budgeted</Text>
              <Text style={styles.overviewValue}>
                {getCurrencySymbol()}{overview.totalBudgeted.toFixed(2)}
              </Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Spent</Text>
              <Text style={[styles.overviewValue, { color: COLORS.danger }]}>
                {getCurrencySymbol()}{overview.totalSpent.toFixed(2)}
              </Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Remaining</Text>
              <Text style={[styles.overviewValue, { color: COLORS.success }]}>
                {getCurrencySymbol()}{overview.remaining.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {budgets.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="wallet-outline" size={80} color={COLORS.gray} />
          <Text style={styles.emptyText}>No budgets set</Text>
          <Text style={styles.emptySubtext}>Create a budget to track your spending</Text>
        </View>
      ) : (
        <FlatList
          data={budgets}
          renderItem={renderBudgetItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddBudget')}
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
  overviewCard: {
    backgroundColor: COLORS.primary,
    padding: 20,
    marginBottom: 10,
  },
  overviewTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewLabel: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 5,
  },
  overviewValue: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  budgetCard: {
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
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  spent: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: 8,
  },
  total: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.light,
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  remaining: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  alertText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
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

export default BudgetsScreen;
