import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { JournalProvider } from './src/context/JournalContext';

function App(): React.JSX.Element {
  return (
    <JournalProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </JournalProvider>
  );
}

export default App;