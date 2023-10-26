import {View, TouchableOpacity} from 'react-native';
import React, {useCallback, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Modal from '../../ui/Modal';
import Text from '../../ui/Text';
import {Portal, TextInput} from 'react-native-paper';
import Input from '../../ui/Input';
import {useLoginMutation} from '../../redux/apis/login.api';
import {validateLoginUser} from '../../utils/validateUser';
import {useNavigation} from '@react-navigation/native';
import {Screen} from 'react-native-screens';
import {ScreenNames} from '../../utils/screenConfig';

export default function Login() {
  const [login, {isSuccess}] = useLoginMutation();
  const navigation = useNavigation();
  const [visible, setvisible] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{email: string; password: string}>({
    email: '',
    password: '',
  });

  const handleToggleModal = useCallback(() => {
    setvisible(!visible);
  }, [visible]);

  const isUserInfoValid = validateLoginUser(userInfo);

  const handleRegisterNavigation = useCallback(() => {
    navigation.navigate(ScreenNames.register);
  }, []);
  const validate = useCallback(() => {
    () => {
      validateLoginUser({
        email: userInfo.email,
        password: userInfo.password,
      });
    };
  }, [userInfo]);

  const handleInputChange = useCallback(
    (key: 'email' | 'password', value: string) => {
      setUserInfo({
        ...userInfo,
        [key]: value,
      });
      validate();
    },
    [userInfo, validate],
  );

  const handleLogin = useCallback(() => {
    login(userInfo);
    if (isSuccess) {
      handleToggleModal();
    }
  }, [handleToggleModal, isSuccess, login, userInfo]);

  return (
    <View className="flex-1 h-full justify-center bg-white">
      <View className="p-4">
        <View className="self-end rounded-full right-[-100] bg-slate-900 p-32 absolute top-[-260]" />
        <View className="self-end rounded-full right-[-80] bg-slate-600 -z-20 p-32 absolute top-[-250]" />
        <View className="self-end rounded-full left-[-100] bg-slate-800 p-32 absolute bottom-[-280]" />
        <View className="self-end rounded-full left-[-80] bg-slate-600 -z-20 p-32 absolute bottom-[-270]" />
        <Text className="text-4xl font-sans-bold pl-4  text-slate-900">
          Login
        </Text>
        <Text className="text-lg p-4 font-sans-bold text-slate-700">
          Welcome Back! Enjoy the Seamless Experience of Chatting
        </Text>
        <Input
          onChangeText={val => handleInputChange('email', val)}
          left={<TextInput.Icon icon={'email'} />}
          cursorColor="black"
          placeholder="Email"
          className="bg-white font-sans-bold"
          underlineColor="white"
          activeUnderlineColor="white"
        />
        <Input
          onChangeText={val => handleInputChange('password', val)}
          left={<TextInput.Icon icon={'eye'} />}
          cursorColor="black"
          placeholder="Password"
          className="bg-white font-sans-bold"
          underlineColor="white"
          activeUnderlineColor="white"
        />
        <Text className="text-red-500 font-sans text-xs text-center">
          {isUserInfoValid.errors.email ||
            isUserInfoValid.errors.password ||
            isUserInfoValid.errors.userName}
        </Text>
        <TouchableOpacity
          disabled={!isUserInfoValid.isValid}
          onPress={handleLogin}
          className="bg-slate-900 self-end p-4 rounded-full">
          <AntDesign name="right" size={24} color={'white'} />
        </TouchableOpacity>
        <View className="justify-center mt-2 items-center">
          <Text className="text-md text-slate-900 items-center justify-center font-sans">
            Don't Have An Account?{' '}
            <Text
              onPress={handleRegisterNavigation}
              className="font-sans-bold text-slate-900">
              Register Now
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
