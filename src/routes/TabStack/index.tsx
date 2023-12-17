import * as React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Profile from '../../pages/Profile';
import Requests from '../../pages/Requests';
import Chats from '../../pages/Chats';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import {ScreenNames} from '../../utils/screenConfig';
import {useSelector} from 'react-redux';
// !auth().currentUser?.emailVerified ? (
//   <View className="bg-black flex-1 p-3 justify-center align-middle">
//     <Text className="font-sans-bold text-white text-lg text-center">
//       Please Verify Your Email before You Proceed
//     </Text>
//     <TouchableOpacity
//       onPress={() => {
//         auth().currentUser?.sendEmailVerification();
//         ToastAndroid.show('Email Sent !', ToastAndroid.LONG);
//       }}
//       className="bg-white mx-8 rounded-full mt-3 p-3">
//       <Text className="text-center font-sans text-md">
//         Send Verification Email
//       </Text>
//     </TouchableOpacity>
//   </View>
// ) : (

const Tab = createMaterialBottomTabNavigator();

export default function TabStack() {
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const showBadge = currentUser?.requests?.length > 0 && {
    tabBarBadge: 0,
  };

  return (
    <Tab.Navigator
      inactiveColor="white"
      activeColor="black"
      barStyle={{
        backgroundColor: 'transparent',
        marginHorizontal: 4,
        marginVertical: 4,
        borderRadius: 50,
        bottom: 4,
        elevation: 100,
        position: 'absolute',
        borderTopWidth: 0.5,
        borderColor: 'rgba(255,2555,255,0.2)',
      }}
      labeled={false}
      screenOptions={{}}>
      <Tab.Screen
        options={{
          tabBarIcon(props) {
            return (
              <Ionicons
                name={!props?.focused ? 'chatbubble-outline' : 'chatbubble'}
                size={24}
                color={props.color}
              />
            );
          },
        }}
        name={ScreenNames.chats}
        component={Chats}
      />
      {/* <Tab.Screen
        options={{
          tabBarIcon(props) {
            return (
              <MaterialIcons
                name={!props?.focused ? 'groups' : 'groups-outline'}
                size={24}
                color={props.color}
              />
            );
          },
        }}
        name={ScreenNames.groups}
        component={Groups}
      /> */}
      <Tab.Screen
        options={{
          ...showBadge,
          tabBarIcon(props) {
            return (
              <Ionicons
                name={
                  !props?.focused ? 'notifications-outline' : 'notifications'
                }
                size={24}
                color={props.color}
              />
            );
          },
        }}
        name={ScreenNames.requests}
        component={Requests}
      />
      <Tab.Screen
        options={{
          tabBarIcon(props) {
            return (
              <Ionicons
                name={!props?.focused ? 'people-outline' : 'people'}
                size={24}
                color={props.color}
              />
            );
          },
        }}
        name={ScreenNames.profile}
        component={Profile}
      />
    </Tab.Navigator>
  );
}
