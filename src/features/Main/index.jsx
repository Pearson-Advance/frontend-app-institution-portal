import { BrowserRouter, Switch, Route } from 'react-router-dom';
import React from 'react';
import { Sidebar } from 'features/Main/Sidebar';
import { Header } from 'features/Main/Header';
import { Footer } from 'features/Main/Footer';
import StudentsPage from 'features/Students/StudentsPage';
import Container from '@edx/paragon/dist/Container';
import { getConfig } from '@edx/frontend-platform';
import InstructorsPage from 'features/Instructors/InstructorsPage';
import './index.scss';

const Main = () => (
  <BrowserRouter basename={getConfig().INSTITUTION_PORTAL_PATH}>
    <div className="pageWrapper">
      <Sidebar />
      <main>
        <Container size="xl">
          <Header />
          <Switch>
            <Route path="/students" exact component={StudentsPage} />
          </Switch>
          <Switch>
            <Route path="/instructors" exact component={InstructorsPage} />
          </Switch>
          <Footer />
        </Container>

      </main>
    </div>
  </BrowserRouter>
);

export default Main;
