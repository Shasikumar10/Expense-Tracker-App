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
import { getIncomes, deleteIncome, getIncomeStats } from '../services/incomeService';
import { COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';

const IncomeScreen = ({ navigation }) => {
  const [incomes, setIncomes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [incomesData, statsData] = await Promise.all([
        getIncomes(),
        getIncomeStats()
      ]);
      
      if (incomesData.success) setIncomes(incomesData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      console.error('Error fetching income:', error);
      Alert.alert('Error', 'Failed to fetch income data');
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
      'Delete Income',
      'Are you sure you want to delete this income entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteIncome(id);
              fetchData();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete income');
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
      Salary: 'briefcase',
      Freelance: 'laptop',
      Business: 'business',
      Investment: 'trending-up',
      Rental: 'home',
      Gift: 'gift',
      Bonus: 'star',
      Refund: 'arrow-undo',
      Other: 'cash',
    };
    return icons[category] || 'cash';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderIncomeItem = ({ item }) => (
    <TouchableOpacity style={styles.incomeCard}>
      <View style={styles.incomeLeft}>
        <View style={[styles.iconContainer, { backgroundColor: COLORS.success + '20' }]}>
          <Ionicons name={getCategoryIcon(item.category)} size={24} color={COLORS.success} />
        </View>
        <View style={styles.incomeInfo}>
          <Text style={styles.source}>{item.source}</Text>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
          {item.isRecurring && (
            <View style={styles.recurringBadge}>
              <Ionicons name="repeat" size={12} color={COLORS.primary} />
              <Text style={styles.recurringText}>{item.frequency}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.incomeRight}>
        <Text style={styles.amount}>
          +{getCurrencySymbol()}{item.amount.toFixed(2)}
        </Text>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {stats && (
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Income Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>This Month</Text>
              <Text style={styles.statValue}>
                {getCurrencySymbol()}{(stats.currentMonth || 0).toFixed(2)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Last Month</Text>
              <Text style={styles.statValue}>
                {getCurrencySymbol()}{(stats.lastMonth || 0).toFixed(2)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>
                {getCurrencySymbol()}{(stats.total || 0).toFixed(2)}
              </Text>
            </View>
          </View>
          {stats.byCategory && stats.byCategory.length > 0 && (
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>By Category</Text>
              {stats.byCategory.map((cat, index) => (
                <View key={index} style={styles.categoryRow}>
                  <Text style={styles.categoryName}>{cat._id}</Text>
                  <Text style={styles.categoryAmount}>
                    {getCurrencySymbol()}{cat.total.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {incomes.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cash-outline" size={80} color={COLORS.gray} />
          <Text style={styles.emptyText}>No income recorded</Text>
          <Text style={styles.emptySubtext}>Add your first income entry</Text>
        </View>
      ) : (
        <FlatList
          data={incomes}
          renderItem={renderIncomeItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddIncome')}
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
  statsCard: {
    backgroundColor: COLORS.success,
    padding: 20,
    marginBottom: 10,
  },
  statsTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 5,
  },
  statValue: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  categorySection: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    padding: 12,
  },
  categoryTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  categoryName: {
    color: COLORS.white,
    fontSize: 13,
  },
  categoryAmount: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
  },
  incomeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  incomeLeft: {
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
  incomeInfo: {
    flex: 1,
  },
  source: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  recurringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBlue,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  recurringText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 3,
  },
  incomeRight: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 8,
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
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default IncomeScreen;
