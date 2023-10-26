import {FlatList, View} from 'react-native';
import React from 'react';
import {FlashList} from '@shopify/flash-list';
import ChatBubble from '../ChatBubble';
import ActivityIndicator from '../../ui/ActivityIndicator';
import Text from '../../ui/Text';

interface IMessages {
  onEndReached: () => void;
  messages: any;
  loading: boolean;
  text: string;
}

function Messages({messages, onEndReached, loading}: IMessages) {
  const renderMessages = ({item}: any) => {
    return (
      <>
        <ChatBubble item={item} />
      </>
    );
  };

  return (
    <View className="h-full flex-[10] rouned-t-[35px] bg-slate-900">
      <View className=" rounded-t-[40px] h-full overflow-hidden mb-[75px] bg-white">
        <View className=" h-full  shadow-slate-900 bg-white-900 pb-20 overflow-hidden mb-[-45px]">
          <FlashList
            estimatedItemSize={85}
            showsVerticalScrollIndicator={false}
            inverted
            // onEndReached={onEndReached}
            data={messages}
            renderItem={renderMessages}
          />
        </View>
      </View>
    </View>
  );
}

export default React.memo(Messages);
