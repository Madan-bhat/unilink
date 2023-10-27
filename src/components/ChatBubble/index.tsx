import {View, Text, Animated, TouchableOpacity} from 'react-native';
import React, {useCallback, useState} from 'react';
import {user} from '../../utils/user';
import moment from 'moment';
import Image from '../../ui/Image';
import ImageView from '../ImageView';

export default function ChatBubble({item, chatUser, currentUser}: any) {
  const [imageViewShown, openImageView] = useState(false);
  const isCurrentUser = user?.uid === item?.sentBy;

  const handleToggleImageView = useCallback(() => {
    openImageView(!imageViewShown);
  }, [imageViewShown]);

  const PLACEHOLDER_IMG =
    'https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg';

  return (
    <View className="mb-1">
      <View
        className={
          !isCurrentUser &&
          'absolute h-12 w-12 z-10 shadow-sm left-1 shadow-slate-900 overflow-hidden items-center justify-center top-3 rounded-full'
        }>
        <Image
          resizeMode="contain"
          source={{uri: currentUser?.userImg || PLACEHOLDER_IMG}}
          className={!isCurrentUser && 'h-full absolute w-full'}
        />
      </View>
      <View
        className={
          isCurrentUser
            ? 'bg-slate-950 mr-2 shadow-xl shadow-slate-950 max-w-[250px] overflow-hidden my-[4px] rounded-[24px]  self-end'
            : 'bg-slate-200 ml-14 shadow-xl shadow-slate-400 max-w-[250px]  overflow-hidden my-[4px] rounded-[24px] self-start'
        }>
        {item?.image && (
          <TouchableOpacity onPress={handleToggleImageView}>
            <Image
              source={{uri: 'data:image/png;base64,' + item?.image}}
              resizeMode="cover"
              className="w-[256px] h-[256px]"
            />
          </TouchableOpacity>
        )}
        <View className="p-2">
          <Text
            className={
              isCurrentUser
                ? 'text-[16px] p-1  text-right font-sans-bold text-white'
                : 'text-[16px] p-1 font-sans-bold text-slate-950'
            }>
            {item?.messageText}
          </Text>
          <Text
            className={
              isCurrentUser
                ? 'text-slate-200 p-1 font-sans text-[10px] text-right'
                : 'text-slate-950 mr-2 font-sans text-[10px] text-left'
            }>
            {moment(item?.date).fromNow()}
          </Text>
        </View>
        <ImageView
          handleClose={handleToggleImageView}
          visible={imageViewShown}
          image={item?.image}
        />
      </View>
    </View>
  );
}
