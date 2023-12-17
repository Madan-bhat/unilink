import {View, Text, TouchableOpacity, ToastAndroid} from 'react-native';
import auth from '@react-native-firebase/auth';
import React, {useCallback} from 'react';

export default function VerificationBanner() {
  const sendVerification = useCallback(() => {
    auth().currentUser?.sendEmailVerification();
    ToastAndroid.show('Email has been sent again', ToastAndroid.LONG);
  }, []);
  return (
    <View className="bg-red-400 p-2 justify-center rounded-lg">
      <View className="justify-center align-middle">
        <View className="flex-row flex">
          <View className="flex">
            <Text className="font-sans-bold text-white">
              A verification link for the provided email has been sent
            </Text>
            <View className="">
              <TouchableOpacity
                className="bg-white align-middle justify-center items-center p-1 rounded-sm max-w-[128px]"
                onPress={sendVerification}>
                <Text className="text-black font-sans text-md">Resend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
