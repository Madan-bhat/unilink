import Realm from 'realm';
import {IMessages} from '../types/Message';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

// Define the Realm schema
class Message {
  text?: string;
  image: string | undefined;
  readBy: string[] | undefined; // Assuming `uid` is a string
  createdAt: FirebaseFirestoreTypes.Timestamp | undefined;
  _id: string | undefined;
  id: string | undefined | undefined;
  liked: boolean | undefined;
  sentBy: string | undefined; // Assuming `uid` is a  string | undefined
  repliedMessage: IMessages | undefined;
  sentTo: string | undefined; // Assuming `uid` is a  string | undefined
  _user:
    | {
        id: string | undefined;
        avatar: string | undefined;
      }
    | undefined;
}
// Open the Realm instance
const realm = new Realm({schema: [Message]});

// Save a message to Realm
export const saveMessageToRealm = (message: any) => {
  realm.write(() => {
    realm.create('Message', message);
  });
};

// Retrieve messages from Realm based on docid
export const getMessagesFromRealm = (docid: string): Realm.Results<any> => {
  return realm.objects('Message').filtered('_id = $0', docid);
};
