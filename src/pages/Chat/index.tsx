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
  const currentUser: any = useSelector(
    (state: {user: any}) => state?.user?.currentUser,
  );
  const [repliedMessage, setRepliedMessage] = useState<IMessages | null>(null);
  const {params} = useRoute();
  const {user}: any = params;
  const docid =
    user?.uid > currentUser?.uid
      ? currentUser?.uid + '-' + user?.uid
      : user?.uid + '-' + currentUser?.uid;

  const [messageBoxShown, setMessageBoxOpen] = useState<Boolean>(false);
  const [isImageUploading, setImageUploading] = useState(false);
  const [loading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [selectedImageModalVisible, setSelectedImageModal] = useState(false);
  const [pagelimit, setPageLimit] = useState(10);

  const chatUser: any = useChatUser({uid: user?.uid});
  const messages = useMessages({
    docId: docid,
    loading: loadingMessages,
    chatUser,
    pagelimit: pagelimit,
  });

  const handleShowMessageBox = useCallback(() => {
    setMessageBoxOpen(!messageBoxShown);
  }, [messageBoxShown]);

  const handleChangeInReplyMessage = useCallback((item: IMessages) => {
    setRepliedMessage(item);
  }, []);

  const handleChangeInPageLimit = useCallback(() => {
    if (messages.length > 0) {
      setLoadingMessages(!loadingMessages);
      setPageLimit(pagelimit + 3);
      setLoadingMessages(!loadingMessages);
    }
  }, [pagelimit, loadingMessages]);

  const handleToggleSelectedImageModal = useCallback(() => {
    setSelectedImageModal(!selectedImageModalVisible);
  }, [selectedImageModalVisible]);

  const handleOpenCamera = useCallback(() => {
    takePhotoFromCamera(setImage, handleToggleSelectedImageModal);
  }, [handleToggleSelectedImageModal]);

  const handleOpenLibrary = useCallback(() => {
    choosePhotoFromLibrary(setImage, handleToggleSelectedImageModal);
  }, [handleToggleSelectedImageModal]);

  const uploadImage = useCallback(async () => {
    if (image) {
      try {
        setImageUploading(!isImageUploading);
        const response = await fetch(image);
        const blob = await response.blob();
        const imageName = `${Date.now()}`; // You can use a unique name for each image
        const ref = storage().ref().child(`images/${imageName}`);
        await ref.put(blob);
        const url = await ref.getDownloadURL();
        return url;
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }, [image, isImageUploading]);

  const updateReadMessage = useCallback(
    debounce(() => {
      let docRef = firestore()
        .collection('chatRoom')
        .doc(docid)
        .collection('messages');
      let unsubscribe = docRef.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          docRef.doc(doc.id).update({
            status: 'RECIEVED',
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
    (message = []) => {
      return sendMessage({
        message,
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
      });
    },
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

  const onLike = useCallback(
    (id: string) => {
      return handleLike({docid, id});
    },
    [docid],
  );

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
          loading={loading}
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
