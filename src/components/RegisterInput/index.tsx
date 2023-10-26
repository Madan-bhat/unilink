import {View, TouchableOpacity, Alert} from 'react-native';
import React, {useCallback, useState} from 'react';
import Text from '../../ui/Text';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from '../../ui/Modal';
import {Portal, TextInput} from 'react-native-paper';
import Input from '../../ui/Input';
import Image from '../../ui/Image';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useRegisterMutation} from '../../redux/apis/login.api';
import {validateRegistrationUser} from '../../utils/validateUser';

export default function RegisterInput() {
  const [register, {error, isSuccess}] = useRegisterMutation();
  const [visible, setvisible] = useState<boolean>(false);
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

  const handleToggleModal = useCallback(() => {
    setvisible(!visible);
  }, [visible]);

  const validate = useCallback(() => {
    () => {
      validateRegistrationUser(userInfo);
    };
  }, [userInfo]);

  const handleRegister = useCallback(() => {
    register(userInfo);
    handleToggleModal();
  }, [register, userInfo, handleToggleModal]);

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
    <View>
      <TouchableOpacity
        onPress={handleToggleModal}
        className="bg-slate-900 p-3 rounded-full w-full items-center">
        <Text className="text-white text-lg">Register</Text>
      </TouchableOpacity>
      <Portal>
        <Modal className="flex-1 h-full bg-white" visible={visible}>
          <View className="p-4">
            <TouchableOpacity
              onPress={handleToggleModal}
              className="absolute bg-slate-500 p-4 rounded-full top-[-25] left-4">
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
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
              left={<TextInput.Icon icon={'nature-people'} />}
              cursorColor="black"
              placeholder="Username"
              className="bg-white font-sans-bold "
              underlineColor="white"
              activeUnderlineColor="white"
            />
            <Input
              value={userInfo.email}
              onChangeText={val => handleInputChange('email', val)}
              left={<TextInput.Icon icon={'email'} />}
              cursorColor="black"
              placeholder="Email"
              className="bg-white font-sans-bold "
              underlineColor="white"
              activeUnderlineColor="white"
            />
            <Input
              value={userInfo.password}
              onChangeText={val => handleInputChange('password', val)}
              left={<TextInput.Icon icon={'eye'} />}
              cursorColor="black"
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
            <TouchableOpacity
              disabled={!isUserInfoValid.isValid}
              onPress={handleRegister}
              className="bg-slate-900 mt-8 self-end p-4 rounded-full">
              <AntDesign name="right" size={24} color={'white'} />
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
