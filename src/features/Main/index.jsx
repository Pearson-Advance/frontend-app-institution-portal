import React, { useState } from 'react';
import './index.scss';
import { Sidebar } from 'features/Main/Sidebar';
import { Header } from 'features/Main/Header';

const Main = () => {
  const [activeTab, setActiveTab] = useState('students');

  const handleTabClick = (tabName) => {
    console.log(tabName);
    setActiveTab(tabName);
  };

  return (
    <div className='pageWrapper'>
      <Sidebar onClickTab={handleTabClick} activeTab={activeTab} />
      <main>
        <Header />
        {activeTab === 'students' && <StudentsContent />}
        {activeTab === 'instructors' && <InstructorsContent />}
      </main>
    </div>
  );
};

// This is an example of Student and instructor content
const StudentsContent = () => {
  return <div>
    <h1>Students Content</h1>
  </div>;
};

const InstructorsContent = () => {
  return <div>
    <h1>
      Instructors Content
    </h1>
  </div>;
};

export default Main;
