import {useEffect, useState, useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';
import {throttle} from 'lodash';

export default function useMessages({
  docId,
  loading,
  pagelimit,
  chatUser,
}: {
  docId: string;
  loading: boolean;
  chatUser: any;
  pagelimit: number;
}) {
  const [messages, setMessages] = useState<any[]>([]);

  const throttledFetchMessages = useCallback(
    throttle(() => {
      if (loading) {
        return;
      }

      let messageRef = firestore()
        .collection('chatRoom')
        .doc(docId)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .limit(pagelimit);

      try {
        messageRef.onSnapshot(querySnapshot => {
          const newMessages = querySnapshot.docs.map(docSnapshot => {
            const data = docSnapshot.data();

            const createdAt =
              data.createdAt && data.createdAt.toDate
                ? data.createdAt.toDate()
                : new Date();
            return {
              ...data,
              id: docSnapshot?.id,
              createdAt,
              received: data?.readBy?.includes(chatUser?.uid),
            };
          });

          setMessages(newMessages);
        });
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }, 1000),
    [docId, loading, chatUser, pagelimit],
  );

  useEffect(() => {
    const unsubscribe = throttledFetchMessages();

    return () => {
      throttledFetchMessages.cancel();
      () => unsubscribe;
    };
  }, [throttledFetchMessages]);

  return messages;
}
