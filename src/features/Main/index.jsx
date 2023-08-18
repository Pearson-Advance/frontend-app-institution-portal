import { BrowserRouter, Switch, Route } from 'react-router-dom';
import React from 'react';
import { Sidebar } from 'features/Main/Sidebar';
import { Header } from 'features/Main/Header';
import { Footer } from 'features/Main/Footer';

import './index.scss';

// This is an example of Student and instructor content
const StudentsContent = () => (<div><h1>Students Content</h1></div>);

const Main = () => (
  <BrowserRouter>
    <div className="pageWrapper">
      <Sidebar />
      <main>
        <Header />
        <Switch>
          <Route path="/students" component={StudentsContent} />
        </Switch>
        <Footer />
      </main>
    </div>
  </BrowserRouter>
);

export default Main;
