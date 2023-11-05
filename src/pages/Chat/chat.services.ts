import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

interface User {
  uid: string;
  // Add other user properties as needed
}

interface Message {
  id: string;
  sentBy: string;
  sentTo: string;
  messageText: string;
  liked: boolean;
  readBy: string[];
  time: string;
  date: number;
  image: string;
  // Add other message properties as needed
}

export const updateReadMessage = (user: User, currentUser: User): void => {
  const docid =
    user.uid > currentUser.uid
      ? currentUser.uid + '-' + user.uid
      : user.uid + '-' + currentUser.uid;

  try {
    let docRef = firestore()
      .collection('chats')
      .doc(docid)
      .collection('messages');
    docRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        docRef.doc(doc.id).update({
          readBy: firestore.FieldValue.arrayUnion(currentUser.uid),
        });
      });
    });
  } catch (error) {
    console.error('Error updating read messages:', error);
  }
};

export const sendPushNotification = async (
  chatUser: User,
  currentUser: User,
  _user: User,
): Promise<void> => {
  // Implement your sendPushNotification function here
  try {
    // Your push notification code
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

export const getMessages = (
  user: User,
  currentUser: User,
  lastVisible: string | undefined,
  setMessages: (messages: Message[]) => void,
  setLastVisible: (lastVisible: string) => void,
  setLoading: (loading: boolean) => void,
): void => {
  setLoading(true);
  if (loading) {
    return;
  }

  const docid =
    user.uid > currentUser.uid
      ? currentUser.uid + '-' + user.uid
      : user.uid + '-' + currentUser.uid;

  const messagesRef = firestore()
    .collection('chats')
    .doc(docid)
    .collection('messages')
    .orderBy('date', 'desc');

  let query = messagesRef;
  if (lastVisible !== undefined) {
    query = query.startAfter(lastVisible);
  }
  query.limit(20).onSnapshot(snapshot => {
    const newMessages = snapshot.docs.map(doc => {
      const {sentBy, sentTo, messageText, liked, readBy, time, date, image} =
        doc.data() as Message;
      return {
        id: doc.id,
        liked,
        sentBy,
        sentTo,
        messageText,
        time,
        date,
        image,
        readBy,
      };
    });
    if (lastVisible) {
      setMessages((prevMessages: Message[]) => [
        ...prevMessages,
        ...newMessages,
      ]);
    } else {
      setMessages(newMessages);
    }

    if (snapshot.docs.length > 0) {
      setLastVisible(snapshot.docs[snapshot.docs.length - 1].id);
    }
  });
};

export const onSend = (
  currentUser: User,
  user: User,
  text: string,
  image: string,
  setText: (text: string) => void,
  setImage: (image: string) => void,
  selectedImageModalVisible: boolean,
  sendPushNotification: () => Promise<void>,
): void => {
  const msg: Message = {
    sentBy: currentUser.uid,
    sentTo: user.uid,
    messageText: text,
    time: moment().format('hh:mm A'),
    date: Date.now(),
    image,
    liked: false,
    readBy: firestore.FieldValue.arrayUnion(currentUser.uid),
  };
  const docid =
    user.uid > currentUser.uid
      ? currentUser.uid + '-' + user.uid
      : user.uid + '-' + currentUser.uid;

  try {
    firestore().collection('chats').doc(docid).collection('messages').add(msg);
    setText('');
    setImage('');
    if (selectedImageModalVisible) {
      handleToggleSelectedImageModal();
    }
    sendPushNotification();
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

export const handleLike = (currentUser: User, user: User, id: string): void => {
  const docid =
    user.uid > currentUser.uid
      ? currentUser.uid + '-' + user.uid
      : user.uid + '-' + currentUser.uid;

  try {
    firestore()
      .collection('chats')
      .doc(docid)
      .collection('messages')
      .doc(id)
      .update({
        liked: true,
      });
  } catch (error) {
    console.error('Error handling like:', error);
  }
};
