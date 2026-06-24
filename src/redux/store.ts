import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from '@/features/auth/slice';
import listingReducer from '@/features/listing/slice/listing.slice';
import favoriteReducer from '@/features/favorite/slice/favorite.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    listing: listingReducer,
    favorite: favoriteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
