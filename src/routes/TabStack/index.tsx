import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Profile from '../../pages/Profile';
import Groups from '../../pages/Groups';
import Requests from '../../pages/Requests';
import Chats from '../../pages/Chats';

import {ScreenNames} from '../../utils/screenConfig';
import {View} from 'react-native';

const Tab = createBottomTabNavigator();

export default function TabStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          marginHorizontal: 4,
          marginVertical: 4,
          borderRadius: 50,
          bottom: 4,
          elevation: 100,
          position: 'absolute',
          borderTopWidth: 0.5,
          borderColor: '#8491b0',
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#0f172a',
      }}>
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
              <Ionicons
                name={
                  !props?.focused ? 'notifications-outline' : 'notifications'
                }
                size={props.size}
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
                size={props.size}
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
