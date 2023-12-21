import React, { useEffect, useReducer } from 'react';
import {
  BrowserRouter, Switch, Route, Redirect,
} from 'react-router-dom';
import { logError } from '@edx/frontend-platform/logging';
import { Sidebar } from 'features/Main/Sidebar';
import { Header } from 'features/Main/Header';
import { Footer } from 'features/Main/Footer';
import StudentsPage from 'features/Students/StudentsPage';
import Container from '@edx/paragon/dist/Container';
import { getConfig } from '@edx/frontend-platform';
import InstructorsPage from 'features/Instructors/InstructorsPage';
import CoursesPage from 'features/Courses/CoursesPage';
import DashboardPage from 'features/Dashboard/DashboardPage';
import reducer from 'features/Main/reducer';
import { getInstitutionName } from 'features/Main/data/api';
import { InstitutionContext } from 'features/Main/institutionContext';
import {
  FETCH_INSTITUTION_DATA_REQUEST,
  FETCH_INSTITUTION_DATA_SUCCESS,
  FETCH_INSTITUTION_DATA_FAILURE,
} from 'features/Main/actionTypes';
import { RequestStatus } from 'features/constants';
import './index.scss';

const initialState = {
  data: [],
  status: RequestStatus.SUCCESS,
  error: null,
};

const Main = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: FETCH_INSTITUTION_DATA_REQUEST });

      try {
        const response = await getInstitutionName();
        dispatch({ type: FETCH_INSTITUTION_DATA_SUCCESS, payload: response.data });
      } catch (error) {
        dispatch({ type: FETCH_INSTITUTION_DATA_FAILURE, payload: error });
        logError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <BrowserRouter basename={getConfig().INSTITUTION_PORTAL_PATH}>
      <InstitutionContext.Provider value={state.data}>
        <Header />
        <div className="pageWrapper">
          <Sidebar />
          <main>
            <Container size="xl" className="px-0 container-pages">
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
              <Footer />
            </Container>
          </main>
        </div>
      </InstitutionContext.Provider>
    </BrowserRouter>
  );
};

export default Main;
