import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { reducer as instructorsReducer } from 'features/Instructors/data';
import { reducer as mainReducer } from 'features/Main/data';
import { reducer as coursesReducer } from 'features/Courses/data';
import { reducer as studentsReducer } from 'features/Students/data';
import { reducer as dashboardReducer } from 'features/Dashboard/data';
import { reducer as licensesReducer } from 'features/Licenses/data';
import { reducer as classesReducer } from 'features/Classes/data';
import { classesApi } from 'features/Classes/data/classesApi';
import { coursesApi } from 'features/Courses/data/coursesApi';
import { instructorsApi } from 'features/Instructors/data/instructorsApi';
import { studentsApi } from 'features/Students/data/studentsApi';

export function initializeStore(preloadedState = undefined) {
  return configureStore({
    reducer: {
      instructors: instructorsReducer,
      main: mainReducer,
      courses: coursesReducer,
      students: studentsReducer,
      dashboard: dashboardReducer,
      licenses: licensesReducer,
      classes: classesReducer,
      [classesApi.reducerPath]: classesApi.reducer,
      [coursesApi.reducerPath]: coursesApi.reducer,
      [instructorsApi.reducerPath]: instructorsApi.reducer,
      [studentsApi.reducerPath]: studentsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
      classesApi.middleware,
      coursesApi.middleware,
      instructorsApi.middleware,
      studentsApi.middleware,
    ),
    preloadedState,
  });
}

export const store = initializeStore();

setupListeners(store.dispatch);
