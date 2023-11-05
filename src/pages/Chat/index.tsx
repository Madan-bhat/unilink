import React, {useCallback, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {View} from 'react-native';
import {useRoute} from '@react-navigation/native';

import ChatHeader from '../../components/ChatHeader';
import Messages from '../../components/Messages';

import {ScreenNames} from '../../utils/screenConfig';

import ImageCropPicker from 'react-native-image-crop-picker';
import SelectedImages from '../../components/SelectedImages';
import {useDispatch, useSelector} from 'react-redux';
import {updateChatUser} from '../../redux/user.slice';

const PLACEHOLDER_IMG =
  'https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg';

export default function Chat() {
  const currentUser = useSelector(
    (state: {user: any}) => state?.user?.currentUser,
  );
  const dispatch = useDispatch();
  const [messages, setMessages] = useState<any>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [isImageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatUser, setChatUser] = useState<any>();
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [selectedImageModalVisible, setSelectedImageModal] = useState(false);

  const {params} = useRoute();
  const {user}: any = params;

  const getChatUser = useCallback(() => {
    firestore()
      .collection('users')
      .doc(user?.uid)
      .onSnapshot(_data => {
        setChatUser(_data?.data());
        dispatch(updateChatUser(_data?.data()));
      });
  }, [dispatch, user?.uid]);

  const handleToggleSelectedImageModal = useCallback(() => {
    setSelectedImageModal(!selectedImageModalVisible);
  }, [selectedImageModalVisible]);

  const uploadImage = useCallback(async () => {
    if (image) {
      try {
        setImageUploading(!isImageUploading);
        const response = await fetch(image);
        const blob = await response.blob();
        const imageName = `${currentUser?.uid}_${Date.now()}.jpg`; // You can use a unique name for each image
        const ref = storage().ref().child(`images/${imageName}`);

        await ref.put(blob);
        const url = await ref.getDownloadURL();
        console.log('Image uploaded successfully. URL:', url);

        return url;
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }, [currentUser?.uid, image, isImageUploading]);

  const takePhotoFromCamera = () => {
    ImageCropPicker.openCamera({
      includeBase64: true,
      cropping: true,
      compressImageQuality: 0.5,
    }).then((_image: any) => {
      setImage(`${_image.path}`);
      handleToggleSelectedImageModal();
    });
  };

  const choosePhotoFromLibrary = () => {
    ImageCropPicker.openPicker({
      compressImageQuality: 0.5,
      includeBase64: true,
      cropping: true,
    }).then((_image: any) => {
      setImage(`${_image.path}`);
      handleToggleSelectedImageModal();
    });
  };

  const updateReadMessage = useCallback(() => {
    const docid =
      user?.uid > currentUser?.uid
        ? currentUser?.uid + '-' + user?.uid
        : user?.uid + '-' + currentUser?.uid;

    try {
      let docRef = firestore()
        .collection('chatRoom')
        .doc(docid)
        .collection('messages');
      docRef.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          docRef.doc(doc.id).update({
            readBy: firestore.FieldValue.arrayUnion(currentUser?.uid),
          });
        });
      });
    } catch (error) {}
  }, [currentUser?.uid, user?.uid]);

  const sendPushNotification = useCallback(async () => {
    const FIREBASE_API_KEY =
      'AAAA8ZDiCIk:APA91bGyCcRU4sBK1s9Jbr7xNniKW2mNIPOUyPRtklYsx8uenMrMkyCzsd8L4Q0XwfjljZ-8JYJeti8BaD_mqGrVLs6icrC9mRADmxImCuHtewcewetNliwOQgKfB51G0IlB-CgaAtUh';
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
      return _response?.json();
    });
  }, [chatUser?.token, currentUser]);

  const loadMoreMessages = useCallback(() => {
    let PAGE_SIZE = 3; // Number of messages to load per page

    if (loading) {
      return;
    }

    setLoading(true);

    if (!lastVisible) {
      setLoading(false);
      return;
    }

    const docId =
      user.uid > currentUser.uid
        ? `${currentUser.uid}-${user.uid}`
        : `${user.uid}-${currentUser.uid}`;

    let messageRef = firestore()
      .collection('chatRoom')
      .doc(docId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .startAfter(lastVisible)
      .limit(PAGE_SIZE);

    try {
      messageRef.get().then(querySnapshot => {
        PAGE_SIZE = querySnapshot.docs.length;
        const newMessages = querySnapshot.docs.map(docSnapshot => {
          const data = docSnapshot.data();

          const createdAt =
            data.createdAt && data.createdAt.toDate
              ? data.createdAt.toDate()
              : new Date();

          return {
            ...data,
            createdAt,
          };
        });

        setMessages((prevMessages: any) => [...prevMessages, ...newMessages]);
        if (querySnapshot.docs.length > 0) {
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        } else {
          setLastVisible(null);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Error fetching more messages:', error);
      setLoading(false);
    }
  }, [currentUser, user, loading, lastVisible]);

  const getInitialMessages = useCallback(() => {
    let PAGE_SIZE = 10; // Number of messages to load per page

    if (loading) {
      return;
    }
    const docId =
      user.uid > currentUser.uid
        ? `${currentUser.uid}-${user.uid}`
        : `${user.uid}-${currentUser.uid}`;
    let messageRef = firestore()
      .collection('chatRoom')
      .doc(docId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .limit(PAGE_SIZE);

    try {
      messageRef.onSnapshot(querySnapshot => {
        const newMessages = querySnapshot.docs.map(docSnapshot => {
          const data = docSnapshot.data();

          const createdAt =
            data.createdAt && data.createdAt.toDate
              ? data.createdAt.toDate()
              : new Date();

          return {
            ...data,
            createdAt,
          };
        });

        setMessages(newMessages);
        if (querySnapshot.docs.length > 0) {
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [currentUser, user, loading]);
  useEffect(() => {
    getInitialMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSend = useCallback(
    async (message: any = []) => {
      const docid =
        user?.uid > currentUser?.uid
          ? currentUser?.uid + '-' + user?.uid
          : user?.uid + '-' + currentUser?.uid;

      try {
        let url: any = ''; // Initialize url to an empty string

        if (image) {
          url = await uploadImage(); // Await the image upload and get the URL
        }

        const createdAt = new Date();

        const msg = {
          ...message[0],
          createdAt,
          _id: message[0]?._id || Date.now(),
          text: message[0]?.text || text,
          sentBy: currentUser?.uid,
          sentTo: user?.uid,
          image: url, // Use the URL obtained from the image upload
          liked: false,
          user: {
            _id: currentUser.uid,
            avatar: chatUser?.userImg || PLACEHOLDER_IMG,
          },
          readBy: firestore.FieldValue.arrayUnion(currentUser?.uid),
        };

        await firestore()
          .collection('chatRoom')
          .doc(docid)
          .collection('messages')
          .add(msg);

        setText('');
        setImage('');
        setImageUploading(!isImageUploading);

        if (selectedImageModalVisible) {
          handleToggleSelectedImageModal();
        }

        sendPushNotification();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    [
      user?.uid,
      currentUser.uid,
      image,
      text,
      chatUser?.userImg,
      isImageUploading,
      selectedImageModalVisible,
      sendPushNotification,
      uploadImage,
      handleToggleSelectedImageModal,
    ],
  );

  const handleLike = useCallback(
    (id: any) => {
      const docid =
        user?.uid > currentUser?.uid
          ? currentUser?.uid + '-' + user?.uid
          : user?.uid + '-' + currentUser?.uid;
      firestore()
        .collection('chatRoom')
        .doc(docid)
        .collection('messages')
        .doc(`${id}`)
        .update({
          liked: true,
        });
    },
    [currentUser?.uid, user?.uid],
  );

  const handleChangeText = useCallback((val: string) => {
    setText(val);
  }, []);

  useEffect(() => {
    getChatUser();
    updateReadMessage();
  }, [getChatUser, updateReadMessage]);

  return (
    <View className="flex h-full bg-black">
      <ChatHeader user={chatUser} />
      <View className="h-full rounded-t-[40px] bg-white flex-1">
        <Messages
          handleInputChange={handleChangeText}
          openCamera={() => takePhotoFromCamera()}
          openLibrary={() => choosePhotoFromLibrary()}
          onSend={onSend}
          onLike={handleLike}
          currentUser={currentUser}
          chatUser={chatUser}
          loading={loading}
          loadMore={loadMoreMessages}
          text={text}
          messages={messages}
        />
      </View>
      <SelectedImages
        isImageUploading={isImageUploading}
        onClose={handleToggleSelectedImageModal}
        text={text}
        onChange={handleChangeText}
        onSend={onSend}
        image={image}
        visible={selectedImageModalVisible}
      />
    </View>
  );
}
