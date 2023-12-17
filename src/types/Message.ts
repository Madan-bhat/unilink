import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {IUser} from './user';

export interface IMessages {
  text?: string;
  image: string;
  readBy: IUser['uid'][];
  createdAt: FirebaseFirestoreTypes.Timestamp;
  _id: string;
  id: string;
  liked: boolean;
  sentBy: IUser['uid'];
  repliedMessage: IMessages;
  sentTo: IUser['uid'];
  _user: {
    id: IUser['uid'];
    avatar: IUser['userImg'];
  };
}
