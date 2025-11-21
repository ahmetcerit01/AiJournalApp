import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DailyEntryScreen from '../screens/DailyEntryScreen';
import HistoryScreen from '../screens/HistoryScreen';

export type RootStackParamList = {
  DailyEntry: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DailyEntry"
        component={DailyEntryScreen}
        options={{ 
          title: 'AI Günlük Asistanım',
        }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ 
          title: 'Geçmiş',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;