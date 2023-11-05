import {View, TouchableOpacity, Alert} from 'react-native';
import React, {useCallback, useState} from 'react';
import * as Animatable from 'react-native-animatable';
import Text from '../../ui/Text';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from '../../ui/Modal';
import {Portal, TextInput} from 'react-native-paper';
import Input from '../../ui/Input';
import Image from '../../ui/Image';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useRegisterMutation} from '../../redux/apis/login.api';
import {validateRegistrationUser} from '../../utils/validateUser';
import ActivityIndicator from '../../ui/ActivityIndicator';

export default function Register() {
  const [register, {error}] = useRegisterMutation();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    email: string;
    userName: string;
    userImg: string;
    password: string;
  }>({
    email: '',
    password: '',
    userName: '',
    userImg: '',
  });
  const isUserInfoValid = validateRegistrationUser(userInfo);

  const validate = useCallback(() => {
    () => {
      validateRegistrationUser(userInfo);
    };
  }, [userInfo]);

  const handleRegister = useCallback(() => {
    setLoading(!loading);
    register(userInfo);
    setLoading(!loading);
  }, [loading, register, userInfo]);

  const takePhotoFromCamera = () => {
    ImageCropPicker.openCamera({
      width: 700,
      height: 700,
      includeBase64: true,
      cropping: true,
    }).then((image: any) => {
      setUserInfo({
        ...userInfo,
        userImg: `data:image/png;base64,${image?.data}`,
      });
    });
  };

  const choosePhotoFromLibrary = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      setUserInfo({
        ...userInfo,
        userImg: `data:image/png;base64,${image?.data}`,
      });
    });
  };

  const handleImageSelection = () => {
    Alert.alert('Select Image', 'Choose an option', [
      {
        text: 'Choose from Library',
        onPress: () => choosePhotoFromLibrary(),
      },
      {
        text: 'Take a Photo',
        onPress: () => takePhotoFromCamera(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };
  const handleInputChange = useCallback(
    (key: 'email' | 'password' | 'userName' | 'userImg', value: string) => {
      setUserInfo({
        ...userInfo,
        [key]: value,
      });
      validate();
    },
    [userInfo, validate],
  );

  return (
    <View className="flex-1 h-full justify-center bg-white">
      <View className="p-4">
        <View className="self-end rounded-full right-[-100] bg-slate-900 p-32 absolute top-[-200]" />
        <View className="self-end rounded-full left-[-100] bg-slate-800 p-32 absolute bottom-[-200]" />
        <Text className="text-4xl pl-4 mt-20 font-sans-bold  text-slate-900">
          Register
        </Text>
        <Text className="text-lg p-4 font-sans-bold  text-slate-700">
          Welcome Back! Enjoy the Seamless Experience of Chatting
        </Text>
        <TouchableOpacity
          onPress={handleImageSelection}
          className="items-center justify-center self-center">
          <Image
            source={{uri: userInfo.userImg}}
            className="h-20 rounded-full w-20 bg-slate-400"
          />
          <Text className="absolute font-extrabold text-3xl text-white self-center">
            +
          </Text>
        </TouchableOpacity>
        <Input
          value={userInfo.userName}
          onChangeText={val => handleInputChange('userName', val)}
          left={<TextInput.Icon color={'black'} icon={'nature-people'} />}
          cursorColor="black"
          textColor="black"
          placeholder="Username"
          className="bg-white font-sans-bold "
          underlineColor="white"
          activeUnderlineColor="white"
        />
        <Input
          value={userInfo.email}
          onChangeText={val => handleInputChange('email', val)}
          left={<TextInput.Icon color={'black'} icon={'email'} />}
          cursorColor="black"
          textColor="black"
          placeholder="Email"
          className="bg-white font-sans-bold "
          underlineColor="white"
          activeUnderlineColor="white"
        />
        <Input
          value={userInfo.password}
          onChangeText={val => handleInputChange('password', val)}
          left={<TextInput.Icon color={'black'} icon={'eye'} />}
          cursorColor="black"
          textColor="black"
          placeholder="Password"
          className="bg-white"
          underlineColor="white"
          activeUnderlineColor="white"
        />
        <Text className="text-red-500 font-sans-bold  text-xs text-center">
          {error ||
            isUserInfoValid.errors.email ||
            isUserInfoValid.errors.password ||
            isUserInfoValid.errors.userName}
        </Text>
        <Animatable.View duration={5000} animation={'bounceInRight'}>
          <TouchableOpacity
            disabled={!isUserInfoValid.isValid}
            onPress={handleRegister}
            className="bg-slate-900 mt-8 self-end p-4 rounded-full">
            {loading ? (
              <ActivityIndicator color={'white'} />
            ) : (
              <AntDesign name="right" size={24} color={'white'} />
            )}
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </View>
  );
}
