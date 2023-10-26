import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import MainStack from './src/routes/MainStack';
import {store} from './src/redux/store.config';
import {PaperProvider} from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      <Provider store={store}>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </Provider>
    </PaperProvider>
  );
}
