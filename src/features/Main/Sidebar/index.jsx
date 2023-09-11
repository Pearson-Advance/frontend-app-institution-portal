import { AppContext } from '@edx/frontend-platform/react';
import { useHistory } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import './index.scss';

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('students');
  const history = useHistory();

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    history.push(`/institution-portal/${tabName}`);
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
        </ul>
      </nav>
    </header>
  );
};
