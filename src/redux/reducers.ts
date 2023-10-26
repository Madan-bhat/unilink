import {chat} from './apis/chat.api';
import {login} from './apis/login.api';

const reducers = {
  [login.reducerPath]: login.reducer,
  [chat.reducerPath]: chat.reducer,
};

export {reducers};
