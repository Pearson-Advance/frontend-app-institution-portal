import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { matchPath, useLocation } from 'react-router-dom';

import { resetClassesFilters } from 'features/Classes/data/slice';

/**
 * Routes that make up the "Classes" experience: the classes list and every
 * page reached while acting on a specific class. The persisted search context
 * is preserved while the user navigates between these routes.
 */
const CLASSES_CONTEXT_ROUTES = [
  '/classes',
  '/courses/:courseId/:classId',
  '/manage-instructors/:courseId/:classId',
];

const isClassesContextPath = (pathname) => CLASSES_CONTEXT_ROUTES.some(
  (route) => matchPath(route, pathname),
);

/**
 * Clears the persisted Classes filters when the user leaves the Classes
 * experience for a different section, keeping them intact while acting on a
 * class (e.g. assigning an instructor or enrolling a student).
 */
export const useResetClassesFiltersOnLeave = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const wasInClassesContext = useRef(false);

  useEffect(() => {
    const inClassesContext = isClassesContextPath(pathname);

    if (wasInClassesContext.current && !inClassesContext) {
      dispatch(resetClassesFilters());
    }

    wasInClassesContext.current = inClassesContext;
  }, [pathname, dispatch]);
};

export default useResetClassesFiltersOnLeave;
