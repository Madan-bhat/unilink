import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import {AppState} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import TabStack from '../TabStack';
import Login from '../../pages/Login';
import Chat from '../../pages/Chat';
import Loading from '../../pages/Loading';

import Search from '../../pages/Search';
import Register from '../../pages/Register';
import ImageView from '../../components/ImageView';
import EditProfile from '../../pages/EditProfile';

import {ScreenNames} from '../../utils/screenConfig';
import {user} from '../../utils/user';

const Stack = createNativeStackNavigator();

function MainStack() {
  const navigation = useNavigation();

  // Add an event listener to track app state changes
  AppState.addEventListener('change', async nextAppState => {
    if (nextAppState === 'background') {
      // App is going to the background
      // Update the user's status to "offline" in Firestore
      const userId = user?.uid; // Replace with the user's ID
      const userRef = firestore().collection('users').doc(userId);

      await userRef.update({status: 'offline'});
    }
  });

  const handleNotificationClick = (navigation, screenName, userId) => {
    navigation.navigate(screenName, {
      user: {
        uid: userId,
      },
    });
  };

  messaging().onNotificationOpenedApp(remoteMessage => {
    if (remoteMessage.data.screen) {
      const {screen, userId}: any = remoteMessage.data;
      handleNotificationClick(navigation, screen, userId);
    }
  });
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        headerShown: false,
      }}>
      <Stack.Screen name={ScreenNames.loading} component={Loading} />
      <Stack.Screen name={ScreenNames.login} component={Login} />
      <Stack.Screen name={ScreenNames.register} component={Register} />
      <Stack.Screen name={ScreenNames.dashboard} component={TabStack} />
      <Stack.Screen name={ScreenNames.chat} component={Chat} />
      <Stack.Screen name={ScreenNames.search} component={Search} />
      <Stack.Screen name={ScreenNames.imageView} component={ImageView} />
      <Stack.Screen name={ScreenNames.editprofile} component={EditProfile} />
    </Stack.Navigator>
  );
}

export default MainStack;
