import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import { uiSlice } from './slices/uiSlice';
import { projectSlice } from './slices/projectSlice';
import { agentsSlice } from './slices/agentsSlice';
import { settingsSlice } from './slices/settingsSlice';
import { loggerMiddleware } from './middleware/loggerMiddleware';

const rootReducer = combineReducers({
  ui: uiSlice.reducer,
  project: projectSlice.reducer,
  agents: agentsSlice.reducer,
  settings: settingsSlice.reducer,
});

const persistConfig = {
  key: 'vibe-ide-root',
  storage,
  whitelist: ['settings'], // Only persist settings
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(loggerMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
