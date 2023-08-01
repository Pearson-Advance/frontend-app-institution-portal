import React, { useState } from 'react';
import { Sidebar } from 'features/Main/Sidebar';
import { Header } from 'features/Main/Header';
import { Footer } from 'features/Main/Footer';

import './index.scss';

const Main = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="pageWrapper">
      <Sidebar onClickTab={handleTabClick} activeTab={activeTab} />
      <main>
        <Header isAccountMenuOpen={isAccountMenuOpen} setIsAccountMenuOpen={setIsAccountMenuOpen} />
        {activeTab === 'students' && <StudentsContent />}
        {activeTab === 'instructors' && <InstructorsContent />}
        <Footer />
      </main>
    </div>
  );
};

// This is an example of Student and instructor content
const StudentsContent = () => (<div><h1>Students Content</h1></div>);
const InstructorsContent = () => (<div><h1>Instructors Content</h1></div>);

export default Main;
