import React from 'react';
import {Text as RPText} from 'react-native-paper';
import {IText} from '../types/Text';

export default function Text(props: IText) {
  return <RPText {...props} />;
}
