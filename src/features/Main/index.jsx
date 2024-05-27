import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select } from 'react-paragon-topaz';
import {
  BrowserRouter, Switch, Route, Redirect,
} from 'react-router-dom';

import { getConfig } from '@edx/frontend-platform';
import { Container, Row, Col } from '@edx/paragon';

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
import CookiePolicyBanner from '@pearsonedunext/frontend-component-cookie-policy-banner';
import ManageInstructors from 'features/Instructors/ManageInstructors';

import { fetchInstitutionData } from 'features/Main/data/thunks';
import { updateSelectedInstitution } from 'features/Main/data/slice';

import './index.scss';

const Main = () => {
  const dispatch = useDispatch();
  const stateInstitutions = useSelector((state) => state.main.institution.data);
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const cookieText = 'This website uses cookies to ensure you get the best experience on our website. If you continue browsing this site, we understand that you accept the use of cookies.';

  useEffect(() => {
    dispatch(fetchInstitutionData());
  }, [dispatch]);

  useEffect(() => {
    if (stateInstitutions.length > 0) {
      const options = stateInstitutions.map(institution => ({
        ...institution,
        label: institution.name,
        value: institution.id,
      }));
      setInstitutionOptions(options);
      dispatch(updateSelectedInstitution(options[0]));
    }
  }, [stateInstitutions, dispatch]);

  const routes = [
    { path: '/dashboard', component: DashboardPage, exact: true },
    { path: '/students', component: StudentsPage, exact: true },
    { path: '/instructors', component: InstructorsPage, exact: true },
    { path: '/instructors/:instructorUsername', component: InstructorsDetailPage, exact: true },
    { path: '/courses', component: CoursesPage, exact: true },
    { path: '/courses/:courseId', component: CoursesDetailPage, exact: true },
    { path: '/courses/:courseId/:classId', component: ClassPage, exact: true },
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
              {stateInstitutions.length > 1 && (
              <Row className="selector-institution">
                <Col md={5}>
                  <h4>Select an institution</h4>
                  <Select
                    styles={{
                      control: base => ({
                        ...base,
                        padding: '3px',
                      }),
                    }}
                    placeholder="Institution"
                    name="institution"
                    options={institutionOptions}
                    defaultValue={institutionOptions[0]}
                    onChange={option => dispatch(updateSelectedInstitution(option))}
                    value={selectedInstitution}
                  />
                </Col>
              </Row>
              )}
            </Container>
            <Switch>
              <Route exact path="/">
                <Redirect to="/dashboard" />
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
