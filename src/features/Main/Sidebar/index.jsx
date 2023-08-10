import { AppContext } from '@edx/frontend-platform/react';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import HomeIcon from '../../../assets/images/home_icon.svg';
import StudentsIcon from '../../../assets/images/students_icon.svg';

export const Sidebar = ({ onClickTab, activeTab }) => {
  const handleTabClick = (tabName) => {
    onClickTab(tabName);
  };
  const { config } = useContext(AppContext);
  return (
    <header className="vertical-nav">
      <div className="logo">
        <a href={`${config.BASE_URL}`}>
          <img src={HomeIcon} alt="icon" />
        </a>
      </div>
      <nav className="hidden nav-menu">
        <ul className="nav-links">
          <li>
            <button
              type="button"
              className={`${activeTab === 'students' ? 'active' : ''} backbutton`}
              aria-current="page"
              onClick={() => handleTabClick('students')}
            >
              <span className="icon">
                <img src={StudentsIcon} alt="icon" />
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
                <img src={StudentsIcon} alt="icon" />
              </span>
              <span className="nav-text">Instructors</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

Sidebar.propTypes = {
  onClickTab: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
};
