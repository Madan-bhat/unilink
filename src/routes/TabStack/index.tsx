import * as React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Profile from '../../pages/Profile';
import Requests from '../../pages/Requests';
import Chats from '../../pages/Chats';

import {ScreenNames} from '../../utils/screenConfig';
import Groups from '../../pages/Groups';

const Tab = createMaterialBottomTabNavigator();

export default function TabStack() {
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
      <Tab.Screen
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
      />
      <Tab.Screen
        options={{
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
