import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import {AppState} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';

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
import Information from '../../pages/Information';

const {Screen, Navigator} = createNativeStackNavigator();

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

  const handleNotificationClick = (
    navigation: NavigationProp<ReactNavigation.RootParamList>,
    screenName: any,
    userId: any,
  ) => {
    return navigation.navigate(screenName, {
      user: {
        uid: userId,
      },
    });
  };

  messaging().onNotificationOpenedApp(remoteMessage => {
    if (remoteMessage?.data?.screen) {
      const {screen, userId}: any = remoteMessage.data;
      handleNotificationClick(navigation, screen, userId);
    }
  });

  const screenConfig = {
    [ScreenNames.loading]: Loading,
    [ScreenNames.login]: Login,
    [ScreenNames.register]: Register,
    [ScreenNames.dashboard]: TabStack,
    [ScreenNames.chat]: Chat,
    [ScreenNames.search]: Search,
    [ScreenNames.editprofile]: EditProfile,
    [ScreenNames.imageView]: ImageView,
    [ScreenNames.information]: Information,
  };

  const screens = Object.keys(screenConfig).map((screenName: any) => ({
    name: screenName,
    component: screenConfig[screenName],
  }));

  return (
    <Navigator
      screenOptions={{
        animation: 'slide_from_right',
        headerShown: false,
      }}>
      {screens?.map(screen => (
        <Screen name={screen?.name} component={screen.component} />
      ))}
    </Navigator>
  );
}

export default MainStack;
