import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useLocation, useHistory,
} from 'react-router-dom';

import { getConfig } from '@edx/frontend-platform';
import { Container, Spinner } from '@edx/paragon';
import { Banner, getUserRoles, USER_ROLES } from 'react-paragon-topaz';

import CookiePolicyBanner from '@pearsonedunext/frontend-component-cookie-policy-banner';

import { Sidebar } from 'features/Main/Sidebar';
import { Header } from 'features/Main/Header';
import { Footer } from 'features/Main/Footer';
import ClassPage from 'features/Classes/Class/ClassPage';
import ClassesPage from 'features/Classes/ClassesPage';
import CoursesPage from 'features/Courses/CoursesPage';
import LicensesPage from 'features/Licenses/LicensesPage';
import StudentsPage from 'features/Students/StudentsPage';
import StudentDetailPage from 'features/Students/StudentDetailPage';
import DashboardPage from 'features/Dashboard/DashboardPage';
import CoursesDetailPage from 'features/Courses/CoursesDetailPage';
import LicensesDetailPage from 'features/Licenses/LicensesDetailPage';
import InstructorsPage from 'features/Instructors/InstructorsPage';
import InstructorsDetailPage from 'features/Instructors/InstructorsDetailPage';
import ActiveTabUpdater from 'features/Main//ActiveTabUpdater';
import ManageInstructors from 'features/Instructors/ManageInstructors';
import InstitutionSelector from 'features/Main/InstitutionSelector';
import UnauthorizedPage from 'features/Main/UnauthorizedPage';

import { fetchInstitutionData } from 'features/Main/data/thunks';
import { updateSelectedInstitution } from 'features/Main/data/slice';

import { useInstitutionIdQueryParam } from 'hooks';

import { cookieText, INSTITUTION_QUERY_ID, RequestStatus } from 'features/constants';

import './index.scss';

const Main = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const institutions = useSelector((state) => state.main.institution.data);
  const addQueryParam = useInstitutionIdQueryParam();
  const roles = getUserRoles();

  const searchParams = new URLSearchParams(location.search);

  const statusInstitutions = useSelector((state) => state.main.institution.status);
  const isLoadingInstitutions = statusInstitutions === RequestStatus.LOADING;

  const bannerText = getConfig().MAINTENANCE_BANNER_TEXT || '';

  const requiredRoles = [USER_ROLES.GLOBAL_STAFF, USER_ROLES.INSTITUTION_ADMIN];
  const isAuthorizedUser = requiredRoles.some(role => roles.includes(role));

  useEffect(() => {
    dispatch(fetchInstitutionData());
  }, [dispatch]);

  useEffect(() => {
    if (institutions.length === 1) {
      searchParams.set(INSTITUTION_QUERY_ID, institutions[0].id);
      history.push({ search: searchParams.toString() });

      dispatch(updateSelectedInstitution(institutions[0]));
    }
  }, [institutions, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const routes = [
    { path: '/dashboard', component: DashboardPage, exact: true },
    { path: '/students', component: StudentsPage, exact: true },
    { path: '/students/:studentEmail', component: StudentDetailPage, exact: true },
    { path: '/instructors', component: InstructorsPage, exact: true },
    { path: '/instructors/:instructorUsername', component: InstructorsDetailPage, exact: true },
    { path: '/courses', component: CoursesPage, exact: true },
    { path: '/courses/:courseId', component: CoursesDetailPage, exact: true },
    { path: '/courses/:courseId/:classId', component: ClassPage, exact: true },
    { path: '/licenses', component: LicensesPage, exact: true },
    { path: '/licenses/:licenseId', component: LicensesDetailPage, exact: true },
    { path: '/classes', component: ClassesPage, exact: true },
    { path: '/manage-instructors/:courseId/:classId', component: ManageInstructors, exact: true },
  ];

  return (
    <BrowserRouter basename={getConfig().INSTITUTION_PORTAL_PATH}>
      <CookiePolicyBanner policyText={{ en: cookieText }} />
      <Header />
      {bannerText && (
        <Banner variant="warning" iconWarning text={bannerText} />
      )}
      <div className="pageWrapper">
        <main className="d-flex">
          {isLoadingInstitutions && (
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <Spinner
                animation="border"
                className="mie-3"
                screenReaderText="loading"
              />
            </div>
          )}
          {!isLoadingInstitutions && !isAuthorizedUser && <UnauthorizedPage />}
          {!isLoadingInstitutions && isAuthorizedUser > 0 && (
            <>
              <Sidebar />
              <Container className="px-0 container-pages">
                <Container size="xl" className="px-4">
                  {institutions.length > 1 && (<InstitutionSelector />)}
                </Container>
                <Switch>
                  <Route exact path="/">
                    <Redirect to={addQueryParam('/dashboard')} />
                  </Route>
                  {routes.map(({ path, exact, component: Component }) => (
                    <Route
                      key={path}
                      path={path}
                      exact={exact}
                      render={() => (
                        <ActiveTabUpdater path={path}>
                          <Component />
                        </ActiveTabUpdater>
                      )}
                    />
                  ))}
                </Switch>
              </Container>
            </>
          )}
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default Main;
