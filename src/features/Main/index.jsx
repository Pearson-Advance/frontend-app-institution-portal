import { BrowserRouter, Switch, Route } from 'react-router-dom';
import React from 'react';
import { Sidebar } from 'features/Main/Sidebar';
import { Header } from 'features/Main/Header';
import { Footer } from 'features/Main/Footer';
import StudentsPage from 'features/Students/StudentsPage';
import './index.scss';

const Main = () => {
  return (
    <BrowserRouter basename="institution-portal">
      <div className="pageWrapper">
        <Sidebar/>
        <main>
          <Header />
          <Switch>
            <Route path="/students" exact render={() => <StudentsPage />} />
          </Switch>
          <Footer />
        </main>
      </div>
    </BrowserRouter>
  );
};

export default Main;
