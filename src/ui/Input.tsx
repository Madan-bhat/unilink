import React from 'react';
import {TextInput as RPInput} from 'react-native-paper';
import {IInput} from '../types/Input';

export default function Input(props: IInput) {
  return (
    <RPInput
      textColor="black"
      style={{
        fontFamily: 'Poppins-Regular',
      }}
      className=" font-sans"
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      {...props}
    />
  );
}
