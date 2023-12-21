/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

const PLACEHOLDER_IMG =
  'https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg';

// PushNotification.configure({
//   onNotification: function (notification) {
//     console.log('Notification:', notification);

//     const customData = notification?.data;

//     const title = customData?.user?.uid
//       ? `New Message from ${customData.user.userName}`
//       : 'New Message';
//     const message = notification?.message || 'Default Notification Message';
//     const userImage = customData?.user?.userImage || PLACEHOLDER_IMG;
//     const image = customData?.user?.image || null;

//     PushNotification.localNotification({
//       channelId: 'default-unilink-chats',
//       title: title,
//       largeIconUrl: userImage,
//       bigPictureUrl: image,

//       message: message,
//     });
//   },
// });

messaging().setBackgroundMessageHandler(async remoteMessage => {
  PushNotification.localNotification({
    channelId: 'default-unilink-chats',
    title: remoteMessage?.data?.userName,
    groupSummary: true,
    smallIcon: '',
    bigLargeIconUrl:
      'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/image8-2.jpg?width=1190&height=800&name=image8-2.jpg',
    message: remoteMessage?.data?.text,
  });
});

PushNotification.createChannel(
  {
    channelId: 'default-unilink-chats',
    channelName: 'default-unilink-chats',
    channelDescription: 'A chat notification channel',
    soundName: 'default',
    importance: 4,
    vibrate: true,
  },
  created => console.log(`Channel created: ${created}`),
);

AppRegistry.registerComponent(appName, () => App);
