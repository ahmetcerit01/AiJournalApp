import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { analyzeText, AnalysisResult } from '../services/ai';
import { useJournal } from '../context/JournalContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'DailyEntry'>;

const DailyEntryScreen: React.FC<Props> = ({ navigation }) => {
  const [text, setText] = useState('');
  const [lastResult, setLastResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const { addEntry } = useJournal();

  const handleAnalyze = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    try {
      setLoading(true);
      const result = await analyzeText(trimmed);
      addEntry(trimmed, result);
      setLastResult(result);
      setText('');
    } catch (error) {
      console.log('Analyze error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Günlük girdi kartı */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bugün nasıl hissediyorsun?</Text>
        <Text style={styles.cardSubtitle}>
          Düşüncelerini buraya yaz, biz de senin için analiz edelim.
        </Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Düşüncelerini buraya yaz..."
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.charCount}>{text.length} / 500 karakter</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            (loading || !text.trim()) && styles.primaryButtonDisabled,
          ]}
          onPress={handleAnalyze}
          disabled={loading || !text.trim()}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Analiz Et</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.secondaryButtonText}>Haftalık Özet</Text>
        </TouchableOpacity>
      </View>

      {/* Analiz sonucu kartı */}
      <View style={styles.card}>
        {loading && (
          <View style={styles.resultBox}>
            <ActivityIndicator />
            <Text style={styles.resultTitle}>Analiz yapılıyor...</Text>
          </View>
        )}

        {!loading && !lastResult && (
          <View style={styles.resultPlaceholder}>
            <View style={styles.placeholderIconCircle}>
              <Text style={styles.placeholderIcon}>📈</Text>
            </View>
            <Text style={styles.placeholderTitle}>Analiz Sonucu</Text>
            <Text style={styles.placeholderText}>
              Girdinizi analiz ettikten sonra duygusal durumunuz ve öneriler burada görünecek.
            </Text>
          </View>
        )}

        {!loading && lastResult && (
          <View style={styles.resultBox}>
            <View style={styles.sentimentRow}>
              <View
                style={[
                  styles.sentimentDot,
                  lastResult.sentiment === 'positive' && { backgroundColor: '#22C55E' },
                  lastResult.sentiment === 'negative' && { backgroundColor: '#EF4444' },
                  lastResult.sentiment === 'neutral' && { backgroundColor: '#9CA3AF' },
                ]}
              />
              <View style={styles.sentimentBadge}>
                <Text style={styles.sentimentText}>
                  {lastResult.sentiment === 'positive'
                    ? 'Pozitif'
                    : lastResult.sentiment === 'negative'
                    ? 'Negatif'
                    : 'Nötr'}
                </Text>
              </View>
            </View>

            <Text style={styles.resultLabel}>Özet</Text>
            <Text style={styles.resultText}>{lastResult.summary}</Text>

            <Text style={[styles.resultLabel, { marginTop: 12 }]}>Öneri</Text>
            <Text style={styles.resultText}>{lastResult.advice}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  inputWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    minHeight: 140,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  input: {
    fontSize: 14,
    color: '#111827',
    flexGrow: 1,
    minHeight: 120,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  primaryButton: {
    height: 44,
    borderRadius: 999,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111827',
  },
  resultBox: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    color: '#111827',
  },
  resultPlaceholder: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  placeholderIcon: {
    fontSize: 28,
    color: '#9CA3AF',
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  tagText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  sentimentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sentimentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6B7280',
    marginRight: 6,
  },
  sentimentBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#ECFDF3',
  },
  sentimentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 13,
    color: '#4B5563',
  },
});

export default DailyEntryScreen;