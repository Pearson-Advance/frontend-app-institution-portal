import React from 'react';
import './index.scss';

export const Sidebar = (props) => {
  const { onClickTab, activeTab } = props;

  const handleTabClick = (tabName) => {
    onClickTab(tabName);
  };

  return (
    <>
      <header className='vertical-nav'>
        <div className='logo'>
          <a href=''>
            <img src='' alt='Pearson' />
          </a>
        </div>
        <nav className='hidden nav-menu'>
          <ul className='nav-links'>
            <li>
              <a
                className={`${activeTab === 'students' ? 'active' : ''} backbutton`}
                aria-current='page'
                href='#'
                onClick={() => handleTabClick('students')}
              >
                <span className='icon'>
                  <svg className="icon-24" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d=""></path>
                  </svg>
                </span>
                <span className='nav-text'>
                  Students
                </span>
              </a>
            </li>
            <li>
              <a
                className={`${activeTab === 'instructors' ? 'active' : ''} backbutton`}
                aria-current='page'
                href='#'
                onClick={() => handleTabClick('instructors')}
              >
                <span className='icon'>
                  <svg className="icon-24" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d=""></path>
                  </svg>
                </span>
                <span className='nav-text'>
                  Instructors
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};
