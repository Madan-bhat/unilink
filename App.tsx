import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import MainStack from './src/routes/MainStack';
import {store} from './src/redux/store.config';
import {PaperProvider} from 'react-native-paper';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import PushNotification from 'react-native-push-notification';

export default function App() {
  PushNotification?.cancelAllLocalNotifications();

  return (
    <ActionSheetProvider>
      <PaperProvider>
        <Provider store={store}>
          <NavigationContainer>
            <MainStack />
          </NavigationContainer>
        </Provider>
      </PaperProvider>
    </ActionSheetProvider>
  );
}
