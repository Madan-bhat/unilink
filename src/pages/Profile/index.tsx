import {View, Text, TouchableOpacity, Linking} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import Image from '../../ui/Image';
import {useNavigation} from '@react-navigation/native';
import {ScreenNames} from '../../utils/screenConfig';

const PLACEHOLDER_IMG =
  'https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg';

export default function Profile() {
  const navigation = useNavigation();
  const currentUser = useSelector(state => state?.user?.currentUser);

  const handleInformationPageNavigation = useCallback(() => {
    navigation.navigate(ScreenNames?.information);
  }, [navigation]);

  const openGmail = () => {
    const email = 'imadanbhat@gmail.com';
    const url = `mailto:${email}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log(`Cannot open Gmail or email app for ${email}`);
        }
      })
      .catch(error => {
        console.error('Error opening Gmail:', error);
      });
  };

  const handleLogOut = useCallback(() => {
    auth().signOut();
    navigation.replace(ScreenNames.login);
  }, [navigation]);

  const handleEditProfileNavigation = useCallback(() => {
    navigation.navigate(ScreenNames.editprofile);
  }, [navigation]);

  return (
    <View className="h-full p-8 bg-primary">
      <View className=" items-center mt-8">
        <View className="items-center">
          <Image
            className="h-44 w-44 rounded-full"
            source={{uri: currentUser?.userImg || PLACEHOLDER_IMG}}
          />
          <View className="bg-white border-[5px] border-primary border-solid absolute bottom-1 right-2 p-2 h-12 w-12 items-center justify-center rounded-full">
            <TouchableOpacity onPress={handleEditProfileNavigation}>
              <AntDesign name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="mt-2 items-center">
          <View className="items-center my-4">
            <Text className="text-white text-xl font-sans-bold">
              {currentUser?.userName}
            </Text>
            <Text className="text-white text-xl font-sans">
              {currentUser?.email || 'test@gmail.com'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleEditProfileNavigation}
            className="bg-white w-4/6 px-12 py-3 rounded-full">
            <Text className="font-sans-bold text-black text-lg">
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View className="flex-row w-full items-center mt-8 justify-between">
          <View>
            <View className="flex-row items-center justify-center">
              <View className=" p-2 rounded-full">
                <Ionicons name="information" size={28} color="white" />
              </View>
              <Text className="text-lg font-sans-bold ml-4 text-white">
                Information
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleInformationPageNavigation}
            className=" p-1 rounded-full">
            <AntDesign name="right" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="items-center mt-5 rounded-full overflow-hidden">
        <TouchableOpacity
          onPress={handleLogOut}
          className="bg-white rounded-full px-6 py-2">
          <Text className="font-sans-bold text-black text-lg">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
