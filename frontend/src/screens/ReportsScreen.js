import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import {
  getFinancialSummary,
  getMonthlyComparison,
  getCategoryAnalysis,
  getSpendingPatterns,
  exportData,
} from '../services/reportsService';
import { COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const ReportsScreen = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const [period, setPeriod] = useState('month');
  const [summary, setSummary] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [categoryAnalysis, setCategoryAnalysis] = useState(null);
  const [patterns, setPatterns] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [activeTab, period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'summary':
          const summaryData = await getFinancialSummary({ period });
          if (summaryData.success) setSummary(summaryData.data);
          break;
        case 'comparison':
          const comparisonData = await getMonthlyComparison({ months: 6 });
          if (comparisonData.success) setComparison(comparisonData.data);
          break;
        case 'category':
          const categoryData = await getCategoryAnalysis({ period });
          if (categoryData.success) setCategoryAnalysis(categoryData.data);
          break;
        case 'patterns':
          const patternsData = await getSpendingPatterns();
          if (patternsData.success) setPatterns(patternsData.data);
          break;
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      Alert.alert(
        'Export Data',
        `Export data in ${format.toUpperCase()} format?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Export',
            onPress: async () => {
              const response = await exportData({ format, period });
              if (response.success) {
                Alert.alert('Success', 'Data exported successfully');
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const getCurrencySymbol = () => {
    const currency = user?.currency || 'USD';
    const symbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥', AUD: 'A$', CAD: 'C$' };
    return symbols[currency] || '$';
  };

  const renderSummary = () => {
    if (!summary) return null;

    const netSavings = (summary.totalIncome || 0) - (summary.totalExpenses || 0);
    const savingsRate = (summary.totalIncome || 0) > 0 
      ? ((netSavings / summary.totalIncome) * 100).toFixed(1)
      : 0;

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Financial Overview</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="arrow-down-circle" size={32} color={COLORS.success} />
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryAmount, { color: COLORS.success }]}>
                {getCurrencySymbol()}{(summary.totalIncome || 0).toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Ionicons name="arrow-up-circle" size={32} color={COLORS.danger} />
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={[styles.summaryAmount, { color: COLORS.danger }]}>
                {getCurrencySymbol()}{(summary.totalExpenses || 0).toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.netSavingsContainer}>
            <Text style={styles.netSavingsLabel}>Net Savings</Text>
            <Text style={[
              styles.netSavingsAmount,
              { color: netSavings >= 0 ? COLORS.success : COLORS.danger }
            ]}>
              {getCurrencySymbol()}{Math.abs(netSavings).toFixed(2)}
            </Text>
            <View style={[
              styles.savingsRateBadge,
              { backgroundColor: netSavings >= 0 ? COLORS.success + '20' : COLORS.danger + '20' }
            ]}>
              <Text style={[
                styles.savingsRateText,
                { color: netSavings >= 0 ? COLORS.success : COLORS.danger }
              ]}>
                {savingsRate}% Savings Rate
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spending Breakdown</Text>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Average Daily</Text>
            <Text style={styles.breakdownValue}>
              {getCurrencySymbol()}{(summary.averageDaily || 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Largest Expense</Text>
            <Text style={styles.breakdownValue}>
              {getCurrencySymbol()}{(summary.largestExpense || 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Total Transactions</Text>
            <Text style={styles.breakdownValue}>{summary.transactionCount || 0}</Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderComparison = () => {
    if (!comparison) return null;

    return (
      <ScrollView style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Last 6 Months Comparison</Text>
        {comparison.map((month, index) => (
          <View key={index} style={styles.comparisonCard}>
            <View style={styles.comparisonHeader}>
              <Text style={styles.comparisonMonth}>{month.month}</Text>
              <Text style={styles.comparisonTotal}>
                {getCurrencySymbol()}{month.expenses.toFixed(2)}
              </Text>
            </View>
            <View style={styles.comparisonDetails}>
              <View style={styles.comparisonDetail}>
                <Ionicons name="arrow-down" size={16} color={COLORS.success} />
                <Text style={styles.comparisonDetailText}>
                  Income: {getCurrencySymbol()}{month.income.toFixed(2)}
                </Text>
              </View>
              <View style={styles.comparisonDetail}>
                <Ionicons name="trending-up" size={16} color={COLORS.textSecondary} />
                <Text style={styles.comparisonDetailText}>
                  Transactions: {month.count}
                </Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar,
                  { 
                    width: `${Math.min((month.expenses / Math.max(...comparison.map(m => m.expenses))) * 100, 100)}%`,
                    backgroundColor: COLORS.primary
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderCategoryAnalysis = () => {
    if (!categoryAnalysis) return null;

    const maxAmount = Math.max(...categoryAnalysis.map(cat => cat.total));

    return (
      <ScrollView style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        {categoryAnalysis.map((category, index) => {
          const percentage = ((category.total / maxAmount) * 100).toFixed(1);
          return (
            <View key={index} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{category._id}</Text>
                <Text style={styles.categoryAmount}>
                  {getCurrencySymbol()}{category.total.toFixed(2)}
                </Text>
              </View>
              <View style={styles.categoryStats}>
                <Text style={styles.categoryCount}>{category.count} transactions</Text>
                <Text style={styles.categoryAverage}>
                  Avg: {getCurrencySymbol()}{category.average.toFixed(2)}
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar,
                    { width: `${percentage}%`, backgroundColor: COLORS.primary }
                  ]} 
                />
              </View>
              <Text style={styles.percentageText}>{percentage}%</Text>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  const renderPatterns = () => {
    if (!patterns) return null;

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spending Patterns</Text>
          
          {patterns.topCategories && patterns.topCategories.length > 0 && (
            <View style={styles.patternSection}>
              <Text style={styles.patternTitle}>Top Categories</Text>
              {patterns.topCategories.map((cat, index) => (
                <View key={index} style={styles.patternItem}>
                  <View style={styles.patternRank}>
                    <Text style={styles.patternRankText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.patternName}>{cat._id}</Text>
                  <Text style={styles.patternValue}>
                    {getCurrencySymbol()}{cat.total.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {patterns.topPaymentMethods && patterns.topPaymentMethods.length > 0 && (
            <View style={styles.patternSection}>
              <Text style={styles.patternTitle}>Payment Methods</Text>
              {patterns.topPaymentMethods.map((method, index) => (
                <View key={index} style={styles.patternItem}>
                  <Ionicons name="card-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.patternName}>{method._id}</Text>
                  <Text style={styles.patternValue}>
                    {getCurrencySymbol()}{method.total.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {patterns.recurringExpenses !== undefined && (
            <View style={styles.patternSection}>
              <Text style={styles.patternTitle}>Recurring Expenses</Text>
              <View style={styles.statBox}>
                <Text style={styles.statBoxValue}>{patterns.recurringExpenses}</Text>
                <Text style={styles.statBoxLabel}>Active subscriptions</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.periodSelector}>
          <Picker
            selectedValue={period}
            onValueChange={setPeriod}
            style={styles.periodPicker}
          >
            <Picker.Item label="This Month" value="month" />
            <Picker.Item label="This Year" value="year" />
            <Picker.Item label="All Time" value="all" />
          </Picker>
        </View>
        <View style={styles.exportButtons}>
          <TouchableOpacity 
            style={styles.exportButton} 
            onPress={() => handleExport('csv')}
          >
            <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
            <Text style={styles.exportText}>CSV</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'summary' && styles.activeTab]}
          onPress={() => setActiveTab('summary')}
        >
          <Text style={[styles.tabText, activeTab === 'summary' && styles.activeTabText]}>
            Summary
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'comparison' && styles.activeTab]}
          onPress={() => setActiveTab('comparison')}
        >
          <Text style={[styles.tabText, activeTab === 'comparison' && styles.activeTabText]}>
            Compare
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'category' && styles.activeTab]}
          onPress={() => setActiveTab('category')}
        >
          <Text style={[styles.tabText, activeTab === 'category' && styles.activeTabText]}>
            Categories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'patterns' && styles.activeTab]}
          onPress={() => setActiveTab('patterns')}
        >
          <Text style={[styles.tabText, activeTab === 'patterns' && styles.activeTabText]}>
            Patterns
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading report...</Text>
        </View>
      ) : (
        <>
          {activeTab === 'summary' && renderSummary()}
          {activeTab === 'comparison' && renderComparison()}
          {activeTab === 'category' && renderCategoryAnalysis()}
          {activeTab === 'patterns' && renderPatterns()}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  periodSelector: {
    flex: 1,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    overflow: 'hidden',
  },
  periodPicker: {
    height: 40,
  },
  exportButtons: {
    marginLeft: 10,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBlue,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.textSecondary,
  },
  tabContent: {
    flex: 1,
    padding: 15,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 15,
  },
  netSavingsContainer: {
    alignItems: 'center',
  },
  netSavingsLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  netSavingsAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  savingsRateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  savingsRateText: {
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  breakdownLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  comparisonCard: {
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
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  comparisonMonth: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  comparisonTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.danger,
  },
  comparisonDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  comparisonDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonDetailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.light,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  categoryCard: {
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
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  categoryAverage: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  percentageText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
  patternSection: {
    marginBottom: 20,
  },
  patternTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  patternItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  patternRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  patternRankText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  patternName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
  },
  patternValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  statBox: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  statBoxValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  statBoxLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default ReportsScreen;
