
import {createAction, Middleware, PayloadAction} from "@reduxjs/toolkit";

type FlashId = string;

export interface FlashData {
  id: FlashId;
  variant: 'success' | 'danger' | 'warning' | 'default';
  message: string;
}

export const initialState = {
  flashes: [] as FlashData[],
};

export const flashActions = {
  push: createAction(
    'flashes/flash',
    (data: Omit<FlashData, 'id'>) => ({
      'payload': {...data, id: Math.random().toString()} as FlashData
    })),
  dismiss: createAction<string>('flashes/dismiss'),
};

export const flashExpiringMiddleware: Middleware =
  (store) => {
    return (next) => {
      return (action) => {
        if (flashActions.push.match(action)) {
          setTimeout(() => {
            store.dispatch(flashActions.dismiss(action.payload.id));
          }, 5000);
        }
        next(action);
      }
    }
  }

export default function flashesReducer(state = initialState, action: any): typeof initialState {
  if (flashActions.push.match(action)) {
    return {
      ...state,
      flashes: [...state.flashes, action.payload],
    };
  } else if (flashActions.dismiss.match(action)) {
    return {
      ...state,
      flashes: state.flashes.filter(flash => flash.id !== action.payload),
    };
  }
  return state;
}