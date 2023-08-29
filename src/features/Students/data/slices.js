import React, { createContext, useContext, useReducer } from 'react';

const StudentEnrollmentsContext = createContext();

const initialState = {
  data: [],
  status: 'success',
  error: null,
  itemsPerPage: 10,
  currentPage: 1,
  numPages: 0,
  filters: {
    isOpen: false,
    erros: {},
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, status: 'loading' };
    case 'FETCH_SUCCESS':
      const { results, count } = action.payload;
      const numPages = Math.ceil(count / state.itemsPerPage);
      return {
        ...state,
        status: 'success',
        data: results,
        numPages: numPages,
        count: count,
      };
    case 'FETCH_FAILURE':
      return {
        ...state, status: 'error',
        error: action.payload,
      };
    case 'UPDATE_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };
    case 'OPEN_MODAL':
      return {
        ...state,
        filters: {
          ...state.filters,
          isOpen: true,
        },
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        filters: {
          ...state.filters,
          isOpen: false,
          errors: {},
        },
      };
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
  };
  return context;
};

export { StudentEnrollmentsProvider, useStudentEnrollments };
