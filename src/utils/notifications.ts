import {ScreenNames} from './screenConfig';

export const sendNotification = async ({
  chatUser,
  currentUser,
}: {
  chatUser: any;
  currentUser: any;
}) => {
  const FIREBASE_API_KEY =
    'AAAAaSe6Jzk:APA91bFvk4flDI24veCqiDWnMFh_xDKmANQy2M0n0lfNVHdi9Qits1Un4crvhMMpNblesweZ5EDk66BkUlHG95Uh82cVjvy9jwLV89Bm6LmRIXLLz91g_F3AAszAL6-8o0hCrYApSArz';
  const message = {
    to: `${chatUser?.token}`,
    notification: {
      body: 'New Message Available',
      OrganizationId: '2',
      content_available: true,
      priority: 'high',
      subtitle: '',
      title: currentUser?.userName,
    },
    data: {
      screen: ScreenNames.chat,
      user: {
        uid: currentUser?.uid,
      },
    },
  };
  let headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: 'key=' + FIREBASE_API_KEY,
  });
  await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers,
    body: JSON.stringify(message),
  }).then(_response => {
    console.log(_response?.json());
    return _response?.json();
  });
};
