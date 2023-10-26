import React from 'react';
import {ActivityIndicator as RPActivityIndicator} from 'react-native-paper';
import {IActivityIndicator} from '../types/ActivityIndicator';

export default function ActivityIndicator(props: IActivityIndicator) {
  return <RPActivityIndicator {...props} />;
}
