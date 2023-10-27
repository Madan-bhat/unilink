import React, {useCallback, useEffect, useState} from 'react';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import {Alert, View} from 'react-native';
import {useRoute} from '@react-navigation/native';

import ChatHeader from '../../components/ChatHeader';
import Messages from '../../components/Messages';
import ChatInput from '../../components/ChatInput';

import {user as currentUser} from '../../utils/user';
import ImageCropPicker from 'react-native-image-crop-picker';
import SelectedImages from '../../components/SelectedImages';
import {ScreenNames} from '../../utils/screenConfig';

export default function Chat() {
  const [emojiBoard, setShowEmojiBoard] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatUser, setChatUser] = useState();
  const [_user, setUser] = useState('');
  const [messages, setMessages] = useState<any>([]);
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
      });
  }, [user?.uid]);

  const getUser = useCallback(() => {
    firestore()
      .collection('users')
      .doc(currentUser?.uid)
      .onSnapshot(_data => {
        setUser(_data?.data());
      });
  }, []);

  const handleToggleSelectedImageModal = useCallback(() => {
    setSelectedImageModal(!selectedImageModalVisible);
  }, [selectedImageModalVisible]);

  const takePhotoFromCamera = () => {
    ImageCropPicker.openCamera({
      includeBase64: true,
      cropping: true,
      compressImageQuality: 0.5,
    }).then((_image: any) => {
      setImage(`${_image?.data}`);
      handleToggleSelectedImageModal();
    });
  };

  const choosePhotoFromLibrary = () => {
    ImageCropPicker.openPicker({
      compressImageQuality: 0.5,
      includeBase64: true,
      cropping: true,
    }).then((_image: any) => {
      setImage(`${_image?.data}`);
      handleToggleSelectedImageModal();
    });
  };

  const handleImageSelection = () => {
    Alert.alert('Select Image', 'Choose an option', [
      {
        text: 'Choose from Library',
        onPress: () => choosePhotoFromLibrary(),
      },
      {
        text: 'Take a Photo',
        onPress: () => takePhotoFromCamera(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const updateReadMessage = useCallback(() => {
    const docid =
      user?.uid > currentUser?.uid
        ? currentUser?.uid + '-' + user?.uid
        : user?.uid + '-' + currentUser?.uid;

    try {
      let docRef = firestore()
        .collection('chats')
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
  }, [user?.uid]);

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
        title: _user?.userName,
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
    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    }).then(_response => {
      console.log(_response);
      return _response?.json();
    });
    console.log(response);
  }, [chatUser?.token, _user?.userName]);

  // const getMessages = useCallback(() => {
  //   if (loading) {
  //     return;
  //   }

  //   setLoading(true);

  //   const docid =
  //     user?.uid > currentUser?.uid
  //       ? currentUser?.uid + '-' + user?.uid
  //       : user?.uid + '-' + currentUser?.uid;

  //   const messagesRef = firestore()
  //     .collection('chats')
  //     .doc(docid)
  //     .collection('messages')
  //     .orderBy('date', 'desc')
  //     .limit(8); // Define batchSize as the number of messages to load at once

  //   if (lastVisible) {
  //     messagesRef.startAfter(lastVisible);
  //   }

  //   try {
  //     messagesRef.onSnapshot(snapshot => {
  //       const newMessages = snapshot.docs.map(doc => {
  //         const {sentBy, sentTo, messageText, read, time, date, image} =
  //           doc.data();
  //         return {
  //           sentBy,
  //           sentTo,
  //           messageText,
  //           time,
  //           date,
  //           image,
  //           read,
  //         };
  //       });

  //       setMessages(prevMessages =>
  //         lastVisible ? [...prevMessages, ...newMessages] : newMessages,
  //       );

  //       if (snapshot.docs.length > 0) {
  //         setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [loading, user?.uid, lastVisible]);

  const getMessages = useCallback(() => {
    setLoading(true);
    if (loading) {
      return;
    }
    const docid =
      user?.uid > currentUser?.uid
        ? currentUser?.uid + '-' + user?.uid
        : user?.uid + '-' + currentUser?.uid;

    try {
      const messagesRef = firestore()
        .collection('chats')
        .doc(docid)
        .collection('messages')
        .orderBy('date', 'desc');

      let query = messagesRef;
      if (lastVisible) {
        query = query.startAfter(lastVisible);
      }
      query.onSnapshot(snapshot => {
        const newMessages = snapshot.docs.map(doc => {
          const {sentBy, sentTo, messageText, read, time, date, image} =
            doc.data();
          return {
            sentBy,
            sentTo,
            messageText,
            time,
            date,
            image,
            read,
          };
        });

        if (lastVisible) {
          setMessages((prevMessages: any) => [...prevMessages, ...newMessages]);
        } else {
          setMessages(newMessages);
        }

        if (snapshot.docs.length > 0) {
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        }
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [loading, user?.uid, lastVisible]);

  const onSend = useCallback(() => {
    const msg = {
      sentBy: currentUser?.uid,
      sentTo: user?.uid,
      messageText: text,
      time: moment().format('hh:mm A'),
      date: Date.now(),
      image,
      readBy: firestore.FieldValue.arrayUnion(currentUser?.uid),
    };
    const docid =
      user?.uid > currentUser?.uid
        ? currentUser?.uid + '-' + user?.uid
        : user?.uid + '-' + currentUser?.uid;

    try {
      firestore()
        .collection('chats')
        .doc(docid)
        .collection('messages')
        .add(msg);
      setText('');
      setImage('');
      if (selectedImageModalVisible) {
        handleToggleSelectedImageModal();
      }
    } catch (error) {}
    sendPushNotification();
  }, [
    handleToggleSelectedImageModal,
    image,
    selectedImageModalVisible,
    sendPushNotification,
    text,
    user?.uid,
  ]);

  const handleChangeText = useCallback((val: string) => {
    setText(val);
  }, []);

  const handleToggleEmojiBoard = useCallback(() => {
    setShowEmojiBoard(!emojiBoard);
  }, [emojiBoard]);

  const handleOnEmojiSelect = useCallback(emoji => {
    setText(prevText => prevText + emoji?.emoji);
  }, []);

  useEffect(() => {
    getMessages();
    getUser();
    getChatUser();
    updateReadMessage();
  }, [getChatUser, getMessages, getUser, updateReadMessage]);

  return (
    <View className="flex h-full bg-slate-900">
      <ChatHeader user={chatUser} />
      <View className="h-full rounded-t-[40px] bg-white flex-1">
        <Messages
          currentUser={_user}
          chatUser={chatUser}
          loading={loading}
          text={text}
          messages={messages}
        />
        <ChatInput
          disabled={
            !text?.replace(/\s/g, '').length > 0 || image ? true : false
          }
          showSelectImage
          selectImage={handleImageSelection}
          isEmojiBoardVisible={emojiBoard}
          onEmojiSelect={handleOnEmojiSelect}
          onEmojiBoardOpen={handleToggleEmojiBoard}
          text={text}
          onChange={handleChangeText}
          onSend={onSend}
        />
      </View>
      <SelectedImages
        onClose={handleToggleSelectedImageModal}
        isEmojiBoardVisible={emojiBoard}
        onEmojiSelect={handleOnEmojiSelect}
        onEmojiBoardOpen={handleToggleEmojiBoard}
        text={text}
        onChange={handleChangeText}
        onSend={onSend}
        image={image}
        visible={selectedImageModalVisible}
      />
    </View>
  );
}
