import { configureStore, combineReducers } from '@reduxjs/toolkit';
import hotelReducer from './hotelSlice';
import categoryReducer from './categorySlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Define the root reducer
const rootReducer = combineReducers({
    hotels: hotelReducer,
    categories: categoryReducer,
});

// Redux Persist configuration
const persistConfig = {
    key: 'root',
    storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,  // Disable serializable check for redux-persist
        }),
});

// Create and export persistor
export const persistor = persistStore(store);

// Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
