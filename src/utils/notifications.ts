import {ScreenNames} from './screenConfig';

export const sendNotification = async ({
  chatUser,
  currentUser,
  image,
  docId,
  text,
}: {
  chatUser?: any;
  currentUser?: any;
  image?: string;
  docId: string;
  text?: string;
}) => {
  const FIREBASE_API_KEY =
    'AAAAaSe6Jzk:APA91bFvk4flDI24veCqiDWnMFh_xDKmANQy2M0n0lfNVHdi9Qits1Un4crvhMMpNblesweZ5EDk66BkUlHG95Uh82cVjvy9jwLV89Bm6LmRIXLLz91g_F3AAszAL6-8o0hCrYApSArz';
  const message = {
    to: `${chatUser?.token}`,
    notification: {
      content_available: true,
      priority: 'high',
    },
    data: {
      text,
      screen: ScreenNames.chat,
      image: image ? image : '',
      group: docId,
      userName: currentUser?.userName,
      // userImg: currentUser?.userImg,
    },
  };
  let headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: 'key=' + FIREBASE_API_KEY,
  });
  let res = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers,
    body: JSON.stringify(message),
  });
  let des = res.json();
  des.then(e => console.log(e));
};
