export const executeThunk = async (thunk, dispatch, getState) => {
  await thunk(dispatch, getState);
};
