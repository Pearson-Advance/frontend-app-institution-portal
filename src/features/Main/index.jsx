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

import { fetchInstitutionData } from 'features/Main/data/thunks';
import { updateSelectedInstitution } from 'features/Main/data/slice';

import './index.scss';

const Main = () => {
  const dispatch = useDispatch();
  const stateInstitutions = useSelector((state) => state.main.institution.data);
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const [institutionOptions, setInstitutionOptions] = useState([]);

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

  return (
    <BrowserRouter basename={getConfig().INSTITUTION_PORTAL_PATH}>
      <Header />
      <div className="pageWrapper">
        <Sidebar />
        <main>
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
              <Route path="/instructors/:instructorUsername" exact component={InstructorsDetailPage} />
            </Switch>
            <Switch>
              <Route path="/courses" exact component={CoursesPage} />
            </Switch>
            <Switch>
              <Route path="/courses/:courseId" exact component={CoursesDetailPage} />
            </Switch>
            <Switch>
              <Route path="/courses/:courseId/:classId" exact component={ClassPage} />
            </Switch>
            <Switch>
              <Route path="/licenses" exact component={LicensesPage} />
            </Switch>
            <Switch>
              <Route path="/licenses/:licenseId" exact component={LicensesDetailPage} />
            </Switch>
            <Switch>
              <Route path="/classes" exact component={ClassesPage} />
            </Switch>
            <Footer />
          </Container>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default Main;
