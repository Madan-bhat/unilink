import {login} from './apis/login.api';
import chatslice from './chat.slice';
import userSlice from './user.slice';

const reducers = {
  [login.reducerPath]: login.reducer,
  [userSlice.name]: userSlice.reducer,
  [chatslice.name]: chatslice.reducer,
};

export {reducers};
