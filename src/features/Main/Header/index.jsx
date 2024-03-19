import React, { useContext } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import { Dropdown } from '@edx/paragon';
import 'features/Main/Header/index.scss';

export const Header = () => {
  const { authenticatedUser } = useContext(AppContext);
  const userName = authenticatedUser.username;
  const questionsLink = () => `${getConfig().HEADER_QUESTIONS_LINK}`;

  return (
    <header className="institution-header py-4 px-3">
      <div className="header-left d-flex">
        <a href={`${getConfig().LMS_BASE_URL}`}>
          <img src={`${getConfig().LOGO_INSTITUTION_PORTAL}`} alt="icon" />
        </a>
        <h3 className="platform-name">CertPREP Management Portal</h3>
      </div>
      <div className="header-right d-flex align-items-center">
        <a href={questionsLink()}>
          <i className="fa-regular fa-circle-question icon" />
        </a>
        <Dropdown className="dropdown-user">
          <Dropdown.Toggle variant="success" id="dropdown-basic-1">
            <i className="fa-regular fa-user icon" />
            {userName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              href={`${getConfig().ACCOUNT_PROFILE_URL}/${authenticatedUser.username}`}
            >
              Profile
            </Dropdown.Item>
            <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/logout`}>Log Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
};
