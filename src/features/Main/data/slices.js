import React, { createContext, useContext, useReducer } from 'react';

const InstitutionNameContext = createContext();

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

const InstitutionNameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <InstitutionNameContext.Provider value={{ state, dispatch }}>
      {children}
    </InstitutionNameContext.Provider>
  );
};

const useInstitutionName = () => {
  const context = useContext(InstitutionNameContext);
  if (!context) {
    throw new Error('useInstitutionName must be used within a InstitutionNameProvider');
  }
  return context;
};

export { InstitutionNameProvider, useInstitutionName };
