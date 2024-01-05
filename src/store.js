import { configureStore } from '@reduxjs/toolkit';
import { reducer as instructorsReducer } from 'features/Instructors/data';
import { reducer as mainReducer } from 'features/Main/data';
import { reducer as coursesReducer } from 'features/Courses/data';
import { reducer as studentsReducer } from 'features/Students/data';

export function initializeStore(preloadedState = undefined) {
  return configureStore({
    reducer: {
      instructors: instructorsReducer,
      main: mainReducer,
      courses: coursesReducer,
      students: studentsReducer,
    },
    preloadedState,
  });
}

export const store = initializeStore();
