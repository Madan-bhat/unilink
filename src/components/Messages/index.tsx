import React from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Actions,
  Bubble,
  Composer,
  Day,
  GiftedChat,
  InputToolbar,
  LoadEarlier,
  MessageImage,
  MessageText,
} from 'react-native-gifted-chat';
import Input from '../../ui/Input';
import ChatInput from '../ChatInput';

interface IMessages {
  onEndReached: () => void;
  messages: any;
  loading: boolean;
  chatUser: any;
  onSend: any;
  currentUser: any;
  text: string;
  onLike: (props: string) => void;
}

function Messages({
  messages,
  openCamera,
  handleInputChange,
  openLibrary,
  currentUser,
  text,
  onSend,
  loading,
  loadMore,
}: any) {
  function renderActions(props) {
    return (
      <Actions
        {...props}
        options={{
          ['Pick Image From Library']: openLibrary,
          ['Camera']: openCamera,
        }}
        icon={props => (
          <>
            <TouchableOpacity
              className={
                'bg-transparent shadow-lg  rounded-full items-center justify-center h-7 w-7'
              }>
              <AntDesign name={'camerao'} size={24} color={'white'} />
            </TouchableOpacity>
          </>
        )}
        onSend={args => onSend(args)}
      />
    );
  }

  return (
    <View className="h-full flex-[10] rouned-t-[35px] bg-black">
      <View className=" rounded-t-[40px] h-full overflow-hidden bg-black">
        <View className=" h-full shadow-slate-900 bg-black-900 overflow-hidden ">
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
                  backgroundColor: 'black',
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
                      shadowColor: '#0f172a',
                      elevation: 14,
                      backgroundColor: 'rgba(162, 164, 171, 0.4)',
                    },
                    left: {
                      borderStyle: 'solid',
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                      borderWidth: 0.2,
                      backgroundColor: 'black',
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
