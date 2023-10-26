import FastImage from 'react-native-fast-image';
import {IImage} from '../types/Image';

export default function Image(props: IImage) {
  return <FastImage {...props} />;
}
