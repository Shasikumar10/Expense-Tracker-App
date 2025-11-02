import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { getExpenseStats } from '../services/expenseService';
import { COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';

const StatsScreen = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getExpenseStats();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrencySymbol = () => {
    const currency = user?.currency || 'USD';
    const symbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥', AUD: 'A$', CAD: 'C$' };
    return symbols[currency] || '$';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading statistics...</Text>
      </View>
    );
  }

  if (!stats || stats.byCategory.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data available</Text>
        <Text style={styles.emptySubtext}>Add expenses to see statistics</Text>
      </View>
    );
  }

  const maxAmount = Math.max(...stats.byCategory.map(cat => cat.totalAmount));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Spending</Text>
          <Text style={styles.summaryAmount}>
            {getCurrencySymbol()}{stats.total.total.toFixed(2)}
          </Text>
          <Text style={styles.summarySubtext}>
            {stats.total.count} transactions
          </Text>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          
          {stats.byCategory.map((category, index) => {
            const percentage = (category.totalAmount / stats.total.total) * 100;
            const barWidth = (category.totalAmount / maxAmount) * 100;
            
            return (
              <View key={category._id} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{category._id}</Text>
                  <Text style={styles.categoryAmount}>
                    {getCurrencySymbol()}{category.totalAmount.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        width: `${barWidth}%`,
                        backgroundColor: getColorForIndex(index)
                      }
                    ]} 
                  />
                </View>
                <View style={styles.categoryFooter}>
                  <Text style={styles.categoryCount}>
                    {category.count} transactions
                  </Text>
                  <Text style={styles.categoryPercentage}>
                    {percentage.toFixed(1)}%
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const getColorForIndex = (index) => {
  const colors = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.success,
    COLORS.warning,
    COLORS.info,
    '#ec4899',
    '#f97316',
    '#84cc16',
    '#06b6d4',
    '#8b5cf6',
  ];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  summaryLabel: {
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 8,
  },
  summaryAmount: {
    color: COLORS.white,
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summarySubtext: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.8,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  categoryItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  barContainer: {
    height: 8,
    backgroundColor: COLORS.light,
    borderRadius: 4,
    marginBottom: 8,
  },
  bar: {
    height: 8,
    borderRadius: 4,
  },
  categoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  categoryPercentage: {
    fontSize: 14,
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
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default StatsScreen;
