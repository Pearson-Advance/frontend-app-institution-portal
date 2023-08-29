import { BrowserRouter, Switch, Route } from 'react-router-dom';
import React from 'react';
import { Sidebar } from 'features/Main/Sidebar';
import { Header } from 'features/Main/Header';
import { Footer } from 'features/Main/Footer';
import StudentsPage from 'features/Students/StudentsPage';

import './index.scss';
import { StudentEnrollmentsProvider } from 'features/Students/data/slices';
import { InstitutionNameProvider } from 'features/Main/data/slices';

const Main = () => (
  <BrowserRouter>
    <div className="pageWrapper">
      <Sidebar />
      <main>
        <InstitutionNameProvider>
          <Header />
        </InstitutionNameProvider>
        <StudentEnrollmentsProvider>
          <Switch>
            <Route path="/students" component={StudentsPage} />
          </Switch>
        </StudentEnrollmentsProvider>
        <Footer />
      </main>
    </div>
  </BrowserRouter>
);

export default Main;
