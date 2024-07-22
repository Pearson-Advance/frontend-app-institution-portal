import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { getConfig } from '@edx/frontend-platform';
import { Container } from '@edx/paragon';

import CookiePolicyBanner from '@pearsonedunext/frontend-component-cookie-policy-banner';

import { Sidebar } from 'features/Main/Sidebar';
import { Header } from 'features/Main/Header';
import { Footer } from 'features/Main/Footer';
import ClassPage from 'features/Classes/Class/ClassPage';
import ClassesPage from 'features/Classes/ClassesPage';
import CoursesPage from 'features/Courses/CoursesPage';
import LicensesPage from 'features/Licenses/LicensesPage';
import StudentsPage from 'features/Students/StudentsPage';
import DashboardPage from 'features/Dashboard/DashboardPage';
import CoursesDetailPage from 'features/Courses/CoursesDetailPage';
import LicensesDetailPage from 'features/Licenses/LicensesDetailPage';
import InstructorsPage from 'features/Instructors/InstructorsPage';
import InstructorsDetailPage from 'features/Instructors/InstructorsDetailPage';
import ActiveTabUpdater from 'features/Main//ActiveTabUpdater';
import ManageInstructors from 'features/Instructors/ManageInstructors';
import InstitutionSelector from 'features/Main/InstitutionSelector';

import { fetchInstitutionData } from 'features/Main/data/thunks';

import { useInstitutionIdQueryParam } from 'hooks';

import { cookieText } from 'features/constants';

import './index.scss';

const Main = () => {
  const dispatch = useDispatch();
  const institutions = useSelector((state) => state.main.institution.data);
  const addQueryParam = useInstitutionIdQueryParam();

  useEffect(() => {
    dispatch(fetchInstitutionData());
  }, [dispatch]);

  const routes = [
    { path: '/dashboard', component: DashboardPage, exact: true },
    { path: '/students', component: StudentsPage, exact: true },
    { path: '/instructors', component: InstructorsPage, exact: true },
    { path: '/instructors/:instructorUsername', component: InstructorsDetailPage, exact: true },
    { path: '/courses', component: CoursesPage, exact: true },
    { path: '/courses/:courseName', component: CoursesDetailPage, exact: true },
    { path: '/courses/:courseName/:className', component: ClassPage, exact: true },
    { path: '/licenses', component: LicensesPage, exact: true },
    { path: '/licenses/:licenseId', component: LicensesDetailPage, exact: true },
    { path: '/classes', component: ClassesPage, exact: true },
    { path: '/manage-instructors/:courseName/:className', component: ManageInstructors, exact: true },
  ];

  return (
    <BrowserRouter basename={getConfig().INSTITUTION_PORTAL_PATH}>
      <CookiePolicyBanner policyText={{ en: cookieText }} />
      <Header />
      <div className="pageWrapper">
        <main className="d-flex">
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
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default Main;
