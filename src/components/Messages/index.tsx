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

interface IMessages {
  onEndReached: () => void;
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
              <MessageText
                {...props}
                textStyle={{
                  color: 'white',
                }}
                customTextStyle={{
                  color: 'white',
                  fontFamily: 'Poppins-Regular',
                }}
              />
            )}
            renderMessageImage={props => {
              return (
                <MessageImage
                  {...props}
                  imageStyle={{
                    width: Dimensions.get('window').width / 1.5,
                    height: Dimensions.get('window').height / 4.5,
                  }}
                />
              );
            }}
            renderDay={props => {
              return (
                <Day
                  {...props}
                  textStyle={{
                    fontFamily: 'Poppins-Bold',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 14,
                  }}
                />
              );
            }}
            renderLoadEarlier={props => (
              <LoadEarlier
                {...props}
                wrapperStyle={{
                  borderStyle: 'solid',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  borderWidth: 0.2,
                  backgroundColor: '#171918',
                  marginBottom: 4,
                  padding: 6,
                }}
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
                    right: {
                      padding: 6,
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
                      padding: 6,
                    },
                  }}
                />
              );
            }}
            listViewProps={{
              showsVerticalScrollIndicator: false,
              marginBottom: 25,
            }}
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
