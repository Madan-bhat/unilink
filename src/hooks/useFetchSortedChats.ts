import {useState, useEffect} from 'react';
import {IUser} from '../types/user';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';

const useSortUsersByLatestMessage = ({userUIDs}: {userUIDs: []}) => {
  const [sortedUsers, setSortedUserUIDs] = useState<any>([]);
  const currentUser = useSelector(state => state.user?.currentUser);

  useEffect(() => {
    const fetchLatestMessages = async (uid: IUser['uid']) => {
      const docid =
        uid > currentUser?.uid
          ? `${currentUser?.uid}-${uid}`
          : `${uid}-${currentUser?.uid}`;
      console.log(docid);
      try {
        const messagesSnapshot = await firestore()
          .collection('users')
          .doc('hAHpe76paCg7tPExHa5fZ0MmwL13-j13R5vpXfKPgUTjbu54jeSWz0Vx2')
          .collection('messages')
          .limit(1)
          .get();

        if (!messagesSnapshot.empty) {
          return messagesSnapshot.docs[0].data();
        }

        return null; // No messages found
      } catch (error) {
        console.error('Error fetching latest messages:', error);
        throw error;
      }
    };

    const get = () => {
      userUIDs.map(uid => fetchLatestMessages(uid));
    };
    get();

    // const sortUsersByLatestMessage = async () => {
    //   try {
    //     const usersWithLatestMessages = await Promise.all(
    //       userUIDs.map(async uid => {
    //         const latestMessage = await fetchLatestMessages(uid);
    //         return {
    //           uid: uid,
    //           latestMessage: latestMessage,
    //         };
    //       }),
    //     );

    //     // Check if usersWithLatestMessages is undefined or not an array
    //     if (!Array.isArray(usersWithLatestMessages)) {
    //       console.error(
    //         'Error: Invalid response when fetching latest messages',
    //       );
    //       return;
    //     }

    //     usersWithLatestMessages.sort((userA, userB) => {
    //       if (!userA.latestMessage) {
    //         return 1;
    //       }
    //       if (!userB.latestMessage) {
    //         return -1;
    //       }
    //       return userB.latestMessage.timestamp - userA.latestMessage.timestamp;
    //     });

    //     const sortedUIDs = usersWithLatestMessages.map(user => user.uid);
    //     setSortedUserUIDs(sortedUIDs);
    //   } catch (error) {
    //     console.error('Error sorting users by latest message:', error);
    //   }
    // };

    // sortUsersByLatestMessage();
  }, [userUIDs]);

  return sortedUsers;
};

export default useSortUsersByLatestMessage;
