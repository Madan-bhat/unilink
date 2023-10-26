import {View, TouchableOpacity} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Modal from '../../ui/Modal';
import Text from '../../ui/Text';
import {Portal, TextInput} from 'react-native-paper';
import Input from '../../ui/Input';
import {useLoginMutation} from '../../redux/apis/login.api';
import {validateLoginUser} from '../../utils/validateUser';
import {ScreenNames} from '../../utils/screenConfig';

export default function LoginInput() {
  const [login, {isSuccess}] = useLoginMutation();
  const [visible, setvisible] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{email: string; password: string}>({
    email: '',
    password: '',
  });

  const handleToggleModal = useCallback(() => {
    setvisible(!visible);
  }, [visible]);

  const isUserInfoValid = validateLoginUser(userInfo);

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
    <View>
      <TouchableOpacity
        onPress={handleToggleModal}
        className="bg-slate-900 p-3 rounded-full w-full items-center">
        <Text className="text-white font-sans text-lg">Login</Text>
      </TouchableOpacity>
      <Portal>
        <Modal className="flex-1 h-full bg-white" visible={visible}>
          <View className="p-4">
            <TouchableOpacity
              onPress={handleToggleModal}
              className="absolute bg-slate-500 p-4 rounded-full top-[-150] left-4">
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
            <View className="self-end rounded-full right-[-100] bg-slate-900 p-32 absolute top-[-260]" />
            <View className="self-end rounded-full left-[-100] bg-slate-800 p-32 absolute bottom-[-280]" />
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
              onPress={handleLogin}
              className="bg-slate-900 self-end p-4 rounded-full">
              <AntDesign name="right" size={24} color={'white'} />
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
