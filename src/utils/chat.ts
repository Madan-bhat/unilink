import firestore from '@react-native-firebase/firestore';
import {sendNotification} from './notifications';
import {IMessages} from '../types/Message';

interface ISend {
  message: any[];
  image: string;
  text: string;
  currentUser: any;
  user: any;
  chatUser: any;
  docid: string;
  selectedImageModalVisible: boolean;
  isImageUploading: boolean;
  repliedMessage: IMessages | null;
  uploadImage: () => any;
  handleCloseReplyBox: () => void;
  handleToggleSelectedImageModal: () => void;
  setText: (props: any) => any;
  setImage: (props: any) => any;
  setImageUploading: (props: any) => any;
}

interface IhandleLike {
  docid: string;
  id: string;
}

const PLACEHOLDER_IMG =
  'https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg';

const handleLike = ({docid, id}: IhandleLike) => {
  firestore()
    .collection('chatRoom')
    .doc(docid)
    .collection('messages')
    .doc(`${id}`)
    .update({
      liked: true,
    });
};

export const sendMessage = async ({
  message = [],
  image,
  text,
  handleCloseReplyBox,
  currentUser,
  user,
  chatUser,
  docid,
  selectedImageModalVisible,
  uploadImage,
  handleToggleSelectedImageModal,
  setText,
  setImage,
  setImageUploading,
  repliedMessage,
}: ISend) => {
  try {
    let messageText = text;
    setText('');
    let url: any = '';
    if (image) {
      url = await uploadImage();
    }
    const createdAt = new Date();

    const msg = {
      ...message[0],
      createdAt,
      _id: message[0]?._id || Date.now(),
      text: message[0]?.text || messageText || '',
      sentBy: currentUser?.uid,
      sentTo: user?.uid,
      image: url || '',
      liked: false,
      status: 'SENT',
      repliedMessage: repliedMessage ? repliedMessage : null,
      user: {
        _id: currentUser.uid,
        avatar: chatUser?.userImg || PLACEHOLDER_IMG,
      },
      readBy: [currentUser?.uid],
    };

    await firestore()
      .collection('chatRoom')
      .doc(docid)
      .collection('messages')
      .add(msg)
      .catch(e => console.log(e));
    messageText = '';
    setText('');
    setImage('');

    if (selectedImageModalVisible) {
      handleToggleSelectedImageModal();
    }
    const sendNotificationProps = {
      chatUser,
      currentUser,
      docId: docid,
      text,
      image,
    };
    sendNotification(sendNotificationProps);
    handleCloseReplyBox();
    setImageUploading(false);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

export {handleLike};
