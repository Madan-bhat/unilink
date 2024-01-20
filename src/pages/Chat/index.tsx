import React, {useCallback, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import debounce from 'lodash/debounce';

import {View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import ChatHeader from '../../components/ChatHeader';
import Messages from '../../components/Messages';

import SelectedImages from '../../components/SelectedImages';
import useMessages from '../../hooks/useMessages';
import useChatUser from '../../hooks/useChatUser';

import {handleLike, sendMessage} from '../../utils/chat';
import {
  choosePhotoFromLibrary,
  takePhotoFromCamera,
} from '../../utils/imagePickerUtils';
import {IMessages} from '../../types/Message';

export default function Chat() {
  const currentUser = useSelector(state => state?.user?.currentUser);
  const [repliedMessage, setRepliedMessage] = useState<IMessages | null>(null);
  const {params} = useRoute();
  const {user} = params;
  const docid =
    user?.uid > currentUser?.uid
      ? `${currentUser?.uid}-${user?.uid}`
      : `${user?.uid}-${currentUser?.uid}`;

  const [messageBoxShown, setMessageBoxOpen] = useState(false);
  const [isImageUploading, setImageUploading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [selectedImageModalVisible, setSelectedImageModal] = useState(false);
  const [pagelimit, setPageLimit] = useState(10);

  const chatUser = useChatUser({uid: user?.uid});
  const messages = useMessages({
    docId: docid,
    loading: loadingMessages,
    chatUser,
    pagelimit: pagelimit,
  });

  const handleShowMessageBox = useCallback(() => {
    setMessageBoxOpen(prev => !prev);
  }, []);

  const handleChangeInReplyMessage = useCallback((item: IMessages) => {
    setRepliedMessage(item);
  }, []);

  const handleChangeInPageLimit = useCallback(() => {
    if (messages.length > 0) {
      setLoadingMessages(true);
      setPageLimit(prev => prev + 3);
      setLoadingMessages(false);
    }
  }, [messages.length]);

  const handleToggleSelectedImageModal = useCallback(() => {
    setSelectedImageModal(prev => !prev);
  }, []);

  const handleOpenCamera = useCallback(() => {
    takePhotoFromCamera(setImage, handleToggleSelectedImageModal);
  }, [handleToggleSelectedImageModal]);

  const handleOpenLibrary = useCallback(() => {
    choosePhotoFromLibrary(setImage, handleToggleSelectedImageModal);
  }, [handleToggleSelectedImageModal]);

  const uploadImage = useCallback(async () => {
    if (image) {
      try {
        setImageUploading(true);
        const response = await fetch(image);
        const blob = await response.blob();
        const imageName = `${Date.now()}`;
        const ref = storage().ref().child(`images/${imageName}`);
        await ref.put(blob);
        const url = await ref.getDownloadURL();
        return url;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error; // Propagate the error
      } finally {
        setImageUploading(false);
      }
    }
  }, [image]);

  const updateReadMessage = useCallback(
    debounce(() => {
      const docRef = firestore()
        .collection('chatRoom')
        .doc(docid)
        .collection('messages');
      const unsubscribe = docRef.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          docRef.doc(doc.id).update({
            status: 'RECEIVED',
            readBy: firestore.FieldValue.arrayUnion(currentUser?.uid),
          });
        });
      });
      return () => unsubscribe;
    }, 100),
    [currentUser?.uid, user?.uid],
  );

  useEffect(() => {
    updateReadMessage();
  }, [updateReadMessage]);

  const handleCloseReplyBox = useCallback(() => {
    setRepliedMessage(null);
  }, []);

  const onSend = useCallback(
    () =>
      sendMessage({
        message: [],
        image,
        text,
        currentUser,
        user,
        chatUser,
        docid,
        selectedImageModalVisible,
        isImageUploading,
        uploadImage,
        handleToggleSelectedImageModal,
        setText,
        repliedMessage,
        setImage,
        setImageUploading,
        handleCloseReplyBox,
      }),
    [
      repliedMessage,
      chatUser,
      handleCloseReplyBox,
      currentUser,
      docid,
      handleToggleSelectedImageModal,
      image,
      isImageUploading,
      selectedImageModalVisible,
      text,
      uploadImage,
      user,
    ],
  );

  const handleChangeText = useCallback((val: string) => {
    setText(val);
  }, []);

  const onLike = useCallback((id: string) => handleLike({docid, id}), [docid]);

  return (
    <View className="flex h-full bg-primary">
      <ChatHeader user={chatUser} />
      <View className="h-full rounded-t-[40px] bg-white flex-1">
        <Messages
          closeBox={handleCloseReplyBox}
          repliedMessage={repliedMessage}
          handleChangeInReplyMessage={handleChangeInReplyMessage}
          handleShowMessageBox={handleShowMessageBox}
          messagesLoading={loadingMessages}
          docid={docid}
          image={image}
          handleInputChange={handleChangeText}
          openCamera={handleOpenCamera}
          openLibrary={handleOpenLibrary}
          onSend={onSend}
          currentUser={currentUser}
          chatUser={chatUser}
          loading={loadingMessages}
          loadMore={handleChangeInPageLimit}
          text={text}
          messages={messages}
          onLike={onLike}
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
