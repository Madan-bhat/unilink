import React from 'react';
import {Dimensions, View} from 'react-native';

import {
  Bubble,
  Day,
  GiftedChat,
  LoadEarlier,
  MessageImage,
  MessageText,
} from 'react-native-gifted-chat';
import ChatInput from '../ChatInput';
import Text from '../../ui/Text';

const chatComponentsStyles = {
  loadEarlierStyles: {
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 0.2,
    backgroundColor: '#171918',
    marginBottom: 4,
    padding: 4,
  },
  chatBubble: {
    right: {
      padding: 4,
      marginTop: 4,
      shadowColor: '#0a0a0a',
      elevation: 14,
      backgroundColor: 'rgba(162, 164, 171, 0.4)',
    },
    left: {
      borderStyle: 'solid',
      borderColor: 'rgba(255, 255, 255, 0.4)',
      borderWidth: 0.2,
      backgroundColor: '#0a0a0a',
      marginBottom: 4,
      padding: 4,
    },
  },
  dateStyles: {
    fontFamily: 'Poppins-Bold',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  listViewProps: {
    showsVerticalScrollIndicator: false,
    marginBottom: 25,
  },
  imageStyles: {
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 4.5,
  },
  textStyles: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
};

interface IMessages {
  messages: any;
  loading: boolean;
  chatUser: any;
  onSend: any;
  currentUser: any;
  text: string;
  openCamera: () => void;
  openLibrary: () => void;
  handleInputChange: (props: string) => void;
  loadMore: () => void;
  onLike: (props: string) => void;
}

function Messages({
  messages,
  openCamera,
  openLibrary,
  handleInputChange,
  currentUser,
  text,
  onSend,
  loading,
  loadMore,
}: IMessages) {
  return (
    <View className="h-full flex-[10] rouned-t-[35px] bg-primary">
      <View className=" rounded-t-[40px] h-full overflow-hidden bg-primary">
        <View className=" h-full shadow-slate-900 bg-primary overflow-hidden ">
          <GiftedChat
            onInputTextChanged={val => handleInputChange(val)}
            showUserAvatar={false}
            renderMessageText={props => (
              <>
                <MessageText
                  {...props}
                  textStyle={{
                    ...chatComponentsStyles.textStyles?.color,
                  }}
                  customTextStyle={{...chatComponentsStyles.textStyles}}
                />
                <Text>{props.currentMessage?.status}</Text>
              </>
            )}
            renderMessageImage={props => {
              return (
                <MessageImage
                  {...props}
                  imageStyle={{
                    ...chatComponentsStyles.imageStyles,
                  }}
                />
              );
            }}
            renderDay={props => {
              return (
                <Day {...props} textStyle={chatComponentsStyles?.dateStyles} />
              );
            }}
            renderLoadEarlier={props => (
              <LoadEarlier
                {...props}
                wrapperStyle={chatComponentsStyles.loadEarlierStyles}
              />
            )}
            renderInputToolbar={props => (
              <>
                <ChatInput
                  openCamera={openCamera}
                  text={text}
                  openLibrary={openLibrary}
                  onChange={handleInputChange}
                  onSend={onSend}
                  showSelectImage={false}
                  isImageUploading={false}
                />
              </>
            )}
            isLoadingEarlier={loading}
            onLoadEarlier={loadMore}
            loadEarlier
            renderBubble={props => {
              return (
                <Bubble
                  {...props}
                  wrapperStyle={{
                    ...chatComponentsStyles.chatBubble,
                  }}
                />
              );
            }}
            listViewProps={chatComponentsStyles?.listViewProps}
            messages={messages}
            onSend={message => onSend(message)}
            user={{
              _id: currentUser?.uid,
            }}
          />
        </View>
      </View>
    </View>
  );
}

export default React.memo(Messages);
