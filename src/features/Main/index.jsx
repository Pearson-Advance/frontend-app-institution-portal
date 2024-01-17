import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  BrowserRouter, Switch, Route, Redirect,
} from 'react-router-dom';
import { Sidebar } from 'features/Main/Sidebar';
import { Header } from 'features/Main/Header';
import { Footer } from 'features/Main/Footer';
import StudentsPage from 'features/Students/StudentsPage';
import Container from '@edx/paragon/dist/Container';
import { getConfig } from '@edx/frontend-platform';
import InstructorsPage from 'features/Instructors/InstructorsPage';
import CoursesPage from 'features/Courses/CoursesPage';
import DashboardPage from 'features/Dashboard/DashboardPage';
import LicensesPage from 'features/Licenses/LicensesPage';
import { fetchInstitutionData } from 'features/Main/data/thunks';
import './index.scss';

const Main = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInstitutionData());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter basename={getConfig().INSTITUTION_PORTAL_PATH}>
      <Header />
      <div className="pageWrapper">
        <Sidebar />
        <main>
          <Container className="px-0 container-pages">
            <Switch>
              <Route exact path="/">
                <Redirect to="/dashboard" />
              </Route>
            </Switch>
            <Switch>
              <Route path="/dashboard" exact component={DashboardPage} />
            </Switch>
            <Switch>
              <Route path="/students" exact component={StudentsPage} />
            </Switch>
            <Switch>
              <Route path="/instructors" exact component={InstructorsPage} />
            </Switch>
            <Switch>
              <Route path="/courses" exact component={CoursesPage} />
            </Switch>
            <Switch>
              <Route path="/licenses" exact component={LicensesPage} />
            </Switch>
            <Footer />
          </Container>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default Main;
