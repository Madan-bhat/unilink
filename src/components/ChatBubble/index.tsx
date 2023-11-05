import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import moment from 'moment';
import {View, Text, Animated, TouchableOpacity} from 'react-native';

import Image from '../../ui/Image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImageView from '../ImageView';

import {user} from '../../utils/user';

export default function ChatBubble({
  item,
  onLike,
  showAvatar,
  shouldShowDate,
  currentUser,
}: any) {
  const [imageViewShown, openImageView] = useState(false);
  const bounceValue = useRef(new Animated.Value(0));
  const likeOpacity = useMemo(
    () => new Animated.Value(item?.liked ? 1 : 0),
    [item?.liked],
  );
  const isCurrentUser = user?.uid === item?.sentBy;

  const handleToggleImageView = useCallback(() => {
    openImageView(!imageViewShown);
  }, [imageViewShown]);

  let lastTap: number;

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      handleLike();
    } else {
      lastTap = now;
    }
  };

  useEffect(() => {
    startBounceAnimation();
  }, []);

  const startBounceAnimation = () => {
    Animated.spring(bounceValue.current, {
      toValue: 1, // End value (bounced)
      friction: 2, // Controls the spring stiffness
      tension: 40,
      useNativeDriver: true, // Add this for better performance
    }).start(); // Start the animation
  };

  useEffect(() => {
    if (item?.isLiked) {
      Animated.timing(likeOpacity, {
        toValue: 1,
        duration: 0, // An immediate transition
        useNativeDriver: false,
      }).start();
    }
  }, [item?.isLiked, likeOpacity]);

  const handleLike = () => {
    Animated.timing(likeOpacity, {
      toValue: 1,
      duration: 500, // Adjust the duration as needed
      useNativeDriver: false,
    }).start();
    onLike(item?.id);
  };

  const PLACEHOLDER_IMG =
    'https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg';

  return (
    <Animated.View>
      {shouldShowDate && (
        <Text className="text-center mt-4">
          {new Date(item?.date).toString()}
        </Text>
      )}

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleDoubleTap}
        className="mb-[4px]">
        {item?.liked && (
          <Animated.View
            style={{
              opacity: likeOpacity,
            }}
            className={
              isCurrentUser
                ? 'bg-white p-1 rounded-full z-[100] absolute bottom-[-10] right-2'
                : 'bg-white shadow-sm shadow-slate-950 p-1 rounded-full z-10 absolute bottom-[-3] left-[64px]'
            }>
            <AntDesign name="heart" size={14} color={'red'} />
          </Animated.View>
        )}
        {showAvatar && (
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
        )}

        <View
          className={
            isCurrentUser
              ? 'bg-slate-950 mr-2 shadow-xl shadow-slate-950 max-w-[250px] overflow-hidden my-[4px] rounded-[24px] self-end'
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
                  ? 'text-[14px] px-1 pt-1  text-right font-sans-bold text-white'
                  : 'text-[14px] px-1 pt-1 font-sans-bold text-slate-950'
              }>
              {item?.messageText}
            </Text>
            <Text
              className={
                isCurrentUser
                  ? 'text-slate-200 p-[4px] font-sans text-[10px] text-right'
                  : 'text-slate-950 pb-[6px] p-[4px] mr-2 font-sans text-[10px] text-left'
              }>
              {item?.time}
            </Text>
          </View>
          <ImageView
            handleClose={handleToggleImageView}
            visible={imageViewShown}
            image={item?.image}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
