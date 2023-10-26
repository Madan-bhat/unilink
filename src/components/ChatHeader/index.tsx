import React, {useCallback} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Text from '../../ui/Text';
import Image from '../../ui/Image';

export default function ChatHeader({user}: any): any {
  const navigation = useNavigation();
  const handleBackNavigation = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View className="flex-row p-2 py-6 items-center">
      <TouchableOpacity onPress={handleBackNavigation}>
        <AntDesign name="left" size={32} color={'white'} />
      </TouchableOpacity>
      <View>
        <Image
          className="h-12 ml-2 rounded-full w-12"
          source={{uri: user?.userImg}}
        />
        {user?.status === 'online' && (
          <View className=" bg-gray-900 border-white border-2 rounded-full absolute bottom-1 right-1 h-4 w-4" />
        )}
      </View>

      <Text className="text-2xl ml-2 text-white font-sans-bold">
        {user?.userName}
      </Text>
    </View>
  );
}
