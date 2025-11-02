import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

const HelpSupportScreen = ({ navigation }) => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  const faqs = [
    {
      id: 1,
      question: 'How do I add an expense?',
      answer: 'Tap the "+" button on the home screen, enter the expense details including amount, category, and description, then tap "Add Expense".',
    },
    {
      id: 2,
      question: 'How do I set up a budget?',
      answer: 'Go to the Budgets tab, tap the "+" button, choose a category, set your budget amount and period, then save.',
    },
    {
      id: 3,
      question: 'Can I track recurring expenses?',
      answer: 'Yes! Go to Profile > Recurring Expenses, tap "+" to add a recurring expense with frequency (weekly, monthly, etc.).',
    },
    {
      id: 4,
      question: 'How do I export my data?',
      answer: 'Go to Settings > Data Management > Export Data. Your expense data will be downloaded in CSV or PDF format.',
    },
    {
      id: 5,
      question: 'How do I change my currency?',
      answer: 'Go to Settings > Preferences > Currency and select your preferred currency from the list.',
    },
    {
      id: 6,
      question: 'Can I add income tracking?',
      answer: 'Yes! Use the Income tab to track all your income sources. This helps calculate your net savings.',
    },
    {
      id: 7,
      question: 'How do I view reports?',
      answer: 'Go to Profile > Reports & Analytics to view detailed charts, monthly comparisons, and spending patterns.',
    },
    {
      id: 8,
      question: 'Is my data secure?',
      answer: 'Yes, all your data is encrypted and stored securely. We use industry-standard security measures to protect your information.',
    },
  ];

  const supportOptions = [
    {
      icon: 'mail-outline',
      title: 'Email Support',
      description: 'Get help via email',
      action: () => Linking.openURL('mailto:shashikumar44887@gmail.com'),
    },
    {
      icon: 'logo-github',
      title: 'GitHub',
      description: 'View source code and report issues',
      action: () => Linking.openURL('https://github.com/Shasikumar10/Expense-Tracker-App'),
    },
    {
      icon: 'document-text-outline',
      title: 'Documentation',
      description: 'Read user guides and tutorials',
      action: () => Alert.alert('Info', 'Documentation coming soon!'),
    },
    {
      icon: 'bug-outline',
      title: 'Report a Bug',
      description: 'Help us improve the app',
      action: () => Alert.alert('Report Bug', 'Please email bug details to shashikumar44887@gmail.com'),
    },
  ];

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleSendFeedback = () => {
    if (feedbackText.trim()) {
      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted. We appreciate your input!',
        [{ text: 'OK', onPress: () => setFeedbackText('') }]
      );
    } else {
      Alert.alert('Error', 'Please enter your feedback');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Quick Help */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Help</Text>
          <View style={styles.card}>
            {supportOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.supportOption,
                  index < supportOptions.length - 1 && styles.supportOptionBorder
                ]}
                onPress={option.action}
              >
                <View style={styles.supportLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={option.icon} size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.supportText}>
                    <Text style={styles.supportTitle}>{option.title}</Text>
                    <Text style={styles.supportDescription}>{option.description}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.card}>
            {faqs.map((faq, index) => (
              <View key={faq.id}>
                <TouchableOpacity
                  style={styles.faqItem}
                  onPress={() => toggleFAQ(faq.id)}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons
                    name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
                {expandedFAQ === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
                {index < faqs.length - 1 && <View style={styles.faqDivider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Feedback */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send Feedback</Text>
          <View style={styles.card}>
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackLabel}>
                We'd love to hear from you! Share your thoughts, suggestions, or report any issues.
              </Text>
              <TextInput
                style={styles.feedbackInput}
                placeholder="Enter your feedback here..."
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={feedbackText}
                onChangeText={setFeedbackText}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendFeedback}
              >
                <Ionicons name="send" size={20} color={COLORS.white} />
                <Text style={styles.sendButtonText}>Send Feedback</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Developer</Text>
              <Text style={styles.infoValue}>Shashi Kumar</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>shashikumar44887@gmail.com</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footerText}>
          Thank you for using Expense Tracker! 💚
        </Text>
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
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  supportOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  supportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightPrimary || COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  supportText: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 3,
  },
  supportDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  faqAnswerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  faqDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  feedbackContainer: {
    padding: 15,
  },
  feedbackLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 15,
    lineHeight: 20,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
    minHeight: 120,
    marginBottom: 15,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 12,
  },
  sendButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 10,
    marginBottom: 30,
  },
});

export default HelpSupportScreen;
