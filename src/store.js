import { configureStore } from '@reduxjs/toolkit';

import { reducer as studentsReducer } from 'features/Students/data';


export function initializeStore(preloadedState = undefined) {
    return configureStore({
        reducer:{
            students: studentsReducer,
        },
        preloadedState,
    });
}

export const store = initializeStore();
