import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateActiveTab } from 'features/Main/data/slice';
import './index.scss';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.main.activeTab);
  const history = useHistory();

  const handleTabClick = (tabName) => {
    dispatch(updateActiveTab(tabName));
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
              className={`${activeTab === 'licenses' ? 'active' : ''} sidebar-item`}
              aria-current="page"
              onClick={() => handleTabClick('licenses')}
            >
              <i className="fa-regular fa-list-check" />
              <span className="nav-text">License inventory</span>
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
