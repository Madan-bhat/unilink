import React from 'react'
import { Text as RPText } from 'react-native-paper'
import { IActivityIndicator } from '../types/ActivityIndicator'
import { IText } from '../types/Text'

export default function Text(props:IText) {
  return (
   <RPText {...props} />
  )
}