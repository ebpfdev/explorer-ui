import {configureStore} from "@reduxjs/toolkit";
import {combineReducers} from "redux";
import navigationReducer from "./navigation";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import flashesReducer, {flashExpiringMiddleware} from "./flashes";

const rootReducer = combineReducers({
  navigation: navigationReducer,
  flashes: flashesReducer,
})


export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(flashExpiringMiddleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
