import {View, TouchableOpacity, Text, Alert, ToastAndroid} from 'react-native';
import React, {useCallback, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import Image from '../../ui/Image';
import Input from '../../ui/Input';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const PLACEHOLDER_IMG =
  'https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg';

export default function EditProfile() {
  const [userNameError, setUserNameError] = useState('');
  const [image, setImage] = useState('');
  const currentUser = useSelector(state => state?.user?.currentUser);
  const navigation = useNavigation();
  const [user, setUser] = useState({
    userName: '',
    userImg: '',
    description: '',
    phone_number: '',
  });

  const {showActionSheetWithOptions} = useActionSheet();
  const onPress = () => {
    const options = ['Choose From Library', 'Open Camera', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (selectedIndex: number) => {
        switch (selectedIndex) {
          case 1:
            takePhotoFromCamera();

            break;

          case 2:
            choosePhotoFromLibrary();

            break;

          case cancelButtonIndex:
          // Canceled
        }
      },
    );
  };

  const takePhotoFromCamera = () => {
    ImageCropPicker.openCamera({
      includeBase64: true,
      cropping: true,
      compressImageQuality: 0.5,
    }).then((_image: any) => {
      setImage(`data:image/png;base64,${_image.data}`);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImageCropPicker.openPicker({
      compressImageQuality: 0.5,
      includeBase64: true,
      cropping: true,
    }).then((_image: any) => {
      setImage(`data:image/png;base64,${_image.data}`);
    });
  };

  const areFieldsNotEmpty = useCallback(
    (user: any) => {
      const isEmpty = /^\s*$/;

      return (
        !isEmpty.test(user.userName || currentUser?.userName) &&
        !isEmpty.test(user.description || currentUser?.description)
      );
    },
    [currentUser?.description, currentUser?.userName],
  );

  const checkUsernameExists = async username => {
    try {
      const usersRef = firestore().collection('users');
      const snapshot = await usersRef.where('username', '==', username).get();

      if (snapshot.empty) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const handleUpdateUser = useCallback(async () => {
    let disabled = areFieldsNotEmpty(user);
    if (disabled) {
      try {
        await firestore()
          .collection('users')
          .doc(currentUser?.uid)
          .update({
            ...currentUser,
            userImg: user?.userImg || currentUser?.userImg,
            description: user?.description || currentUser?.description,
            userName: user?.userName || currentUser?.userName,
          })
          .then(d => {
            ToastAndroid.show('Updated Successfully !!!', ToastAndroid.LONG);
            navigation.goBack();
          });
      } catch (e) {}
    } else {
      ToastAndroid.show(
        'Fill All the Fields. Before You Proceed',
        ToastAndroid.LONG,
      );
    }
  }, [areFieldsNotEmpty, currentUser, navigation, user]);

  const handleInputChange = useCallback(
    async (
      key: 'userName' | 'userImg' | 'description' | 'phone_number',
      value: string,
    ) => {
      if (key === 'userName') {
        const usernameExists = await checkUsernameExists(value.toLowerCase());

        if (usernameExists) {
          setUserNameError('Username is taken. Please choose a different one.');
        } else {
          setUser({
            ...user,
            [key]: value,
          });
        }
      } else {
        setUser({
          ...user,
          [key]: value,
        });
      }
    },
    [user],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View className="h-full p-8 bg-primary">
      <View>
        <AntDesign
          onPress={handleGoBack}
          name="close"
          size={24}
          color={'white'}
        />
      </View>
      <View className=" items-center mt-8">
        <View className="items-center">
          <Image
            resizeMode="contain"
            className="h-44 w-44 rounded-full"
            source={{uri: currentUser?.userImg || image || PLACEHOLDER_IMG}}
          />
          <View className="bg-white border-[5px] border-primary border-solid absolute bottom-1 right-2 p-2 h-12 w-12 items-center justify-center rounded-full">
            <TouchableOpacity onPress={onPress}>
              <AntDesign name="camerao" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="mt-8">
        <Input
          cursorColor="black"
          className="bg-white mb-4 text-lg rounded-full font-sans-bold"
          onChangeText={val => {
            handleInputChange('userName', val);
          }}
          placeholder="User Name"
        />
        {userNameError?.length > 0 && (
          <Text className="text-red-600 font-sans-bold mb-2 text-center">
            {userNameError + 'kfbjhvb'}
          </Text>
        )}
        <Input
          cursorColor="black"
          value={user?.description || currentUser?.description}
          className="bg-white mb-4 text-lg rounded-full font-sans-bold"
          onChangeText={val => {
            handleInputChange('description', val);
          }}
          placeholder="Description"
        />
        <Input
          cursorColor="black"
          value={user?.phone_number || currentUser?.phone_number}
          className="bg-white mb-4 text-lg rounded-full font-sans-bold"
          onChangeText={val => {
            handleInputChange('phone_number', val);
          }}
          placeholder="Phone Number(optional)"
        />
      </View>

      <View className="items-center mt-5 rounded-full overflow-hidden">
        <TouchableOpacity
          onPress={handleUpdateUser}
          className="bg-white rounded-full px-6 py-2">
          <Text className="font-sans-bold text-black text-lg">Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
