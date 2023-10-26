import {configureStore} from '@reduxjs/toolkit';
import {reducers} from './reducers';
import {login} from './apis/login.api';
import {setupListeners} from '@reduxjs/toolkit/query';
import {chat} from './apis/chat.api';

export const store = configureStore({
  reducer: reducers,
  middleware: gDM => gDM().concat(login.middleware, chat.middleware),
});

setupListeners(store.dispatch);
