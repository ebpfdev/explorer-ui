
import {createAction} from "@reduxjs/toolkit";

export type NavigationTopKind = 'progs' | 'maps';

export const initialState = {
  selectedKind: 'progs' as NavigationTopKind,
  highlightedMaps: [] as number[],
  highlightedProgs: [] as number[],
};

export const navigationActions = {
  selectKind: createAction<NavigationTopKind>('nav/selectKind'),
  highlightMaps: createAction<{maps: number[]}>('nav/highlightMaps'),
  highlightProgs: createAction<{programs: number[]}>('nav/highlightProgs'),
};

export default function navigationReducer(state = initialState, action: any): typeof initialState {
  if (navigationActions.selectKind.match(action)) {
    return {
      ...state,
      selectedKind: action.payload
    };
  } else if (navigationActions.highlightMaps.match(action)) {
    return {
      ...state,
      highlightedMaps: action.payload.maps,
    };
  } else if (navigationActions.highlightProgs.match(action)) {
    return {
      ...state,
      highlightedProgs: action.payload.programs,
    };
  }
  return state;
}