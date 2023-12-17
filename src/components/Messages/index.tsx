import React from 'react';
import {FlashList} from '@shopify/flash-list';
import {Text, TouchableOpacity, View} from 'react-native';

import {IUser} from '../../types/user';
import {IMessages} from '../../types/Message';

import ChatBubble from '../ChatBubble';
import ChatInput from '../ChatInput';
import ActivityIndicator from '../../ui/ActivityIndicator';
import ReplyBox from '../ReplyBox';

interface IMessage {
  messages: IMessages[];
  loading: boolean;
  chatUser: IUser;
  onSend: () => void;
  repliedMessage: IMessages | null;
  currentUser: IUser;
  text: string;
  image: string;
  openCamera: () => void;
  openLibrary: () => void;
  docid: string;
  handleShowMessageBox: (props: boolean) => void;
  handleInputChange: (props: string) => void;
  loadMore: () => void;
  messagesLoading: boolean;
  closeBox: () => void;
  onLike: (props: string) => void;
  handleChangeInReplyMessage: (prop: IMessages) => void;
}

function Messages({
  closeBox,
  handleChangeInReplyMessage,
  messages,
  openCamera,
  messagesLoading,
  openLibrary,
  handleInputChange,
  loadMore,
  currentUser,
  repliedMessage,
  chatUser,
  handleShowMessageBox,
  text,
  onSend,
  loading,
  image,
  docid,
}: IMessage) {
  const renderItem = ({item, index}: {item: IMessages; index: number}) => {
    return (
      <ChatBubble
        repliedMessage={repliedMessage}
        handleShowMessageBox={handleShowMessageBox}
        docid={docid}
        chatUser={chatUser}
        item={item}
        index={index}
        messages={messages}
        handleChangeInReplyMessage={handleChangeInReplyMessage}
        currentUser={currentUser}
      />
    );
  };
  return (
    <View className="h-full flex-[10] rouned-t-[35px] bg-primary">
      <View className=" rounded-t-[40px] h-full overflow-hidden bg-primary">
        <View className=" h-full shadow-slate-900 bg-primary overflow-hidden ">
          <View
            className={
              repliedMessage !== null ? 'h-full pb-[128px]' : 'h-full pb-[78px]'
            }>
            <FlashList
              onEndReached={loadMore}
              onEndReachedThreshold={0.1}
              ListFooterComponent={
                messagesLoading ? (
                  <ActivityIndicator size={24} color="white" />
                ) : (
                  <></>
                )
              }
              showsVerticalScrollIndicator={false}
              estimatedItemSize={200}
              inverted
              data={messages}
              renderItem={renderItem}
            />
          </View>
          {repliedMessage && (
            <ReplyBox
              closeBox={closeBox}
              message={repliedMessage}
              currentUser={currentUser}
              chatUser={chatUser}
            />
          )}
          <ChatInput
            repliedMessage={repliedMessage}
            onChange={handleInputChange}
            onSend={onSend}
            text={text}
            showSelectImage={true}
            openCamera={openCamera}
            openLibrary={openLibrary}
            isImageUploading={loading}
            image={image}
          />
        </View>
      </View>
    </View>
  );
}

export default React.memo(Messages);
