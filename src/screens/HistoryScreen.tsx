import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useJournal } from '../context/JournalContext';
import { JournalEntry } from '../context/JournalContext';


const getSentimentLabel = (sentiment: JournalEntry['sentiment']) => {
  if (sentiment === 'positive') return 'Pozitif';
  if (sentiment === 'negative') return 'Negatif';
  return 'Nötr';
};

// rozet bg color (duyguya göre)
const getSentimentBadgeBackground = (sentiment: JournalEntry['sentiment']) => {
  if (sentiment === 'positive') return '#ECFDF3'; // açık yeşil
  if (sentiment === 'negative') return '#FEF2F2'; // açık kırmızı
  return '#F3F4F6'; // açık gri
};

// rozet text rengi
const getSentimentTextColor = (sentiment: JournalEntry['sentiment']) => {
  if (sentiment === 'positive') return '#16A34A'; // yeşil
  if (sentiment === 'negative') return '#DC2626'; // kırmızı
  return '#4B5563'; // gri
};


//context ile geçmiş entries alınıyor.
const HistoryScreen: React.FC = () => {
  const { entries, clearEntries } = useJournal();

  return (
    <View style={styles.container}>
      {entries.length === 0 ? (
      // kayıt yoksa basit bir bilgilendirme metni göster.
        <Text style={styles.emptyText}>
          Henüz bir günlük girişi yapmadın. 
        </Text>
      ) : (
        <>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Geçmiş</Text>
            <TouchableOpacity
              onPress={() => {
                if (!entries.length) return;
                Alert.alert(
                  'Geçmişi sil',
                  'Tüm geçmiş konuşmaları silmek istediğine emin misin?',
                  [
                    { text: 'Vazgeç', style: 'cancel' },
                    {
                      text: 'Evet, sil',
                      style: 'destructive',
                      onPress: () => {
                        clearEntries();
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={styles.clearText}>Tümünü Sil</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={entries}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const date = new Date(item.createdAt);
              const formatted = date.toLocaleString();

              return (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.text}>{item.text}</Text>
                    <View
                      style={[
                        styles.sentimentBadge,
                        { backgroundColor: getSentimentBadgeBackground(item.sentiment) },
                      ]}
                    >
                      <Text
                        style={[
                          styles.sentimentBadgeText,
                          { color: getSentimentTextColor(item.sentiment) },
                        ]}
                      >
                        {getSentimentLabel(item.sentiment)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.date}>{formatted}</Text>
                  </View>
                </View>
              );
            }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F7',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
    color: '#6B7280',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DC2626',
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardFooter: {
    marginTop: 4,
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  sentimentBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  sentimentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default HistoryScreen;