import { BrowserRouter, Switch, Route } from 'react-router-dom';
import React from 'react';
import { Sidebar } from 'features/Main/Sidebar';
import { Header } from 'features/Main/Header';
import { Footer } from 'features/Main/Footer';
import StudentsPage from 'features/Students/StudentsPage';
import './index.scss';

const Main = () => {
  const currentPath = window.location.href.split('/')[3];
  return (
    <BrowserRouter>
      <div className="pageWrapper">
        <Sidebar currentPath={currentPath} />
        <main>
          <Header />
          <Switch>
            <Route path={`/${currentPath}/students`} exact component={StudentsPage} />
          </Switch>
          <Footer />
        </main>
      </div>
    </BrowserRouter>
  );
};

export default Main;
