
import {createAction} from "@reduxjs/toolkit";

export type NavigationTopKind = 'progs' | 'maps';

export const initialState = {
  selectedKind: 'progs' as NavigationTopKind,
};

export const navigationActions = {
  selectKind: createAction<NavigationTopKind>('tower/connectToTower'),
};

export default function navigationReducer(state = initialState, action: any): typeof initialState {
  if (navigationActions.selectKind.match(action)) {
    return {
      ...state,
      selectedKind: action.payload
    };
  }
  return state;
}