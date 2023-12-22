import { AppContext } from '@edx/frontend-platform/react';
import { useHistory } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUser, faBook } from '@fortawesome/free-solid-svg-icons';
import './index.scss';

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const history = useHistory();

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    history.push(`/${tabName}`);
  };

  const { config } = useContext(AppContext);

  return (
    <header className="vertical-nav">
      <div className="logo">
        <a href={`${config.LMS_BASE_URL}`}>
          <img src={`${getConfig().LOGO_URL}`} alt="icon" />
        </a>
      </div>
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
              className={`${activeTab === 'students' ? 'active' : ''} backbutton`}
              aria-current="page"
              onClick={() => handleTabClick('students')}
            >
              <span className="icon">
                <FontAwesomeIcon icon={faUsers} />
              </span>
              <span className="nav-text">Students</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${activeTab === 'instructors' ? 'active' : ''} backbutton`}
              aria-current="page"
              onClick={() => handleTabClick('instructors')}
            >
              <span className="icon">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <span className="nav-text">Instructors</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${activeTab === 'courses' ? 'active' : ''} backbutton`}
              aria-current="page"
              onClick={() => handleTabClick('courses')}
            >
              <span className="icon">
                <FontAwesomeIcon icon={faBook} />
              </span>
              <span className="nav-text">Courses</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};
