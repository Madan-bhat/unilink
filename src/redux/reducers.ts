import {login} from './apis/login.api';
import chatSlice from './chat.slice';
import userSlice from './user.slice';

const reducers = {
  [login.reducerPath]: login.reducer,
  [userSlice.name]: userSlice.reducer,
  [chatSlice.name]: chatSlice.reducer,
};

export {reducers};
