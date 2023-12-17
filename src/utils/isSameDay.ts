import dayjs from 'dayjs';

export function isSameDay(currentMessage: any, diffMessage: any) {
  if (!currentMessage?.createdAt || !diffMessage?.createdAt) {
    return false;
  }
  const currentMessageCreatedAt = dayjs(currentMessage?.createdAt);
  const diffMessageCreatedAt = dayjs(diffMessage?.createdAt);

  return currentMessageCreatedAt.isSame(diffMessageCreatedAt, 'day');
}
