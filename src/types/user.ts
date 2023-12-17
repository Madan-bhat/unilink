import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export interface IUser {
  uid: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  chats: IUser['uid'][];
  description: string;
  email: string;
  groups: string[];
  status: 'online' | 'offline';
  token: string;
  userName: string;
  userImg: string;
}
