import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './index.scss';

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const history = useHistory();

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    history.push(`/${tabName}`);
  };

  return (
    <header className="vertical-nav">
      <nav className="nav-menu">
        <ul className="nav-links">
          <li>
            <button
              type="button"
              className={`${activeTab === 'dashboard' ? 'active' : ''} sidebar-item`}
              aria-current="page"
              onClick={() => handleTabClick('dashboard')}
            >
              <i className="fa-regular fa-house" />
              <span className="nav-text">Home</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${activeTab === 'instructors' ? 'active' : ''} sidebar-item`}
              aria-current="page"
              onClick={() => handleTabClick('instructors')}
            >
              <i className="fa-regular fa-chalkboard-user" />
              <span className="nav-text">Instructors</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${activeTab === 'students' ? 'active' : ''} sidebar-item`}
              aria-current="page"
              onClick={() => handleTabClick('students')}
            >
              <i className="fa-regular fa-screen-users" />
              <span className="nav-text">Students</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${activeTab === 'courses' ? 'active' : ''} sidebar-item`}
              aria-current="page"
              onClick={() => handleTabClick('courses')}
            >
              <i className="fa-regular fa-bars-sort" />
              <span className="nav-text">Courses</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};
