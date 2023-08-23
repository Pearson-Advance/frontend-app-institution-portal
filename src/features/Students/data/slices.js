import React, { createContext, useContext, useReducer } from 'react';

const StudentEnrollmentsContext = createContext();

const initialState = {
  data: [],
  status: 'success',
  error: null,
  
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, status: 'loading' };
    case 'FETCH_SUCCESS':
      return { ...state, status: 'success', data: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, status: 'error', error: action.payload };
    default:
      return state;
  }
};

const StudentEnrollmentsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StudentEnrollmentsContext.Provider value={{ state, dispatch }}>
      {children}
    </StudentEnrollmentsContext.Provider>
  );
};

const useStudentEnrollments = () => {
  const context = useContext(StudentEnrollmentsContext);
  if (!context) {
    throw new Error('useStudentEnrollments must be used within a StudentEnrollmentsProvider');
  }
  return context;
};

export { StudentEnrollmentsProvider, useStudentEnrollments };
