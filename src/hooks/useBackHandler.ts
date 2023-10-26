import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import {Alert, BackHandler} from 'react-native';

export const useBackHandler = () => {
  const handleBackPress = () => {
    // Alert.alert(
    //   'You are exiting the app',
    //   '',
    //   [
    //     {
    //       text: 'Exit',
    //       onPress: () => BackHandler.exitApp(),
    //     },
    //     {
    //       text: 'Cancel',
    //       onPress: () => {},
    //       style: 'cancel',
    //     },
    //   ],
    //   {cancelable: true},
    // );
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => backHandler.remove();
    }, []),
  );
};
