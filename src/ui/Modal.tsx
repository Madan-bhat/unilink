import React from 'react';
import {Modal as RPModal} from 'react-native-paper';
import {IModal} from '../types/Modal';

export default function Modal(props: IModal) {
  return <RPModal {...props} />;
}
