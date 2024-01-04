import { configureStore } from '@reduxjs/toolkit';
import { reducer as instructorsReducer } from 'features/Instructors/data';
import { reducer as mainReducer } from 'features/Main/data';

export function initializeStore(preloadedState = undefined) {
  return configureStore({
    reducer: {
      instructors: instructorsReducer,
      main: mainReducer,
    },
    preloadedState,
  });
}

export const store = initializeStore();
