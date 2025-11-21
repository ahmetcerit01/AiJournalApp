import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalysisResult } from '../services/ai';

export interface JournalEntry extends AnalysisResult {
  id: string;
  text: string;
  createdAt: string;
  advice: string;
}

interface JournalContextValue {
  entries: JournalEntry[];
  addEntry: (text: string, analysis: AnalysisResult) => void;
  clearEntries: () => void;
}

const STORAGE_KEY = 'JOURNAL_ENTRIES_V1';

const JournalContext = createContext<JournalContextValue | undefined>(
  undefined,
);

export const JournalProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  //asyncStorage'tan veriyi yükle
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue) {
          const parsed: JournalEntry[] = JSON.parse(jsonValue);
          setEntries(parsed);
        }
      } catch (error) {
        console.log('asyncstorage error:', error);
      }
    };

    loadEntries();
  }, []);

  // her değişimde kaydet
  useEffect(() => {
    const saveEntries = async () => {
      try {
        const jsonValue = JSON.stringify(entries);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      } catch (error) {
        console.log('asyncstorage error:', error);
      }
    };

    if (entries.length >= 0) {
      saveEntries();
    }
  }, [entries]);

  const addEntry = (text: string, analysis: AnalysisResult) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      text,
      createdAt: new Date().toISOString(),
      sentiment: analysis.sentiment,
      summary: analysis.summary,
      advice: analysis.advice,
    };

    setEntries(prev => [newEntry, ...prev]);
  };

  const clearEntries = () => {
    // bellekteki listi temizle
    setEntries([]);

    // asyncstoragedaki veriyi de temizle
    AsyncStorage.removeItem(STORAGE_KEY).catch(error => {
      console.log('asyncstorage error:', error);
    });
  };

  const value: JournalContextValue = {
    entries,
    addEntry,
    clearEntries,
  };

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const ctx = useContext(JournalContext);
  if (!ctx) {
    throw new Error('useJournal must be used within JournalProvider');
  }
  return ctx;
};