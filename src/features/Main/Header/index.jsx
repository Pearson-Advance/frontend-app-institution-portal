import React, { useContext } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAmericas } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from '@edx/paragon';
import 'features/Main/Header/index.scss';

export const Header = () => {
  const { authenticatedUser, config } = useContext(AppContext);
  const userName = authenticatedUser.username;

  return (
    <header className="institution-header py-4 px-3">
      <div className="header-left d-flex">
        <a href={`${config.LMS_BASE_URL}`}>
          <img src="/images/logoPearson.png" alt="icon" />
        </a>
        <h3 className="platform-name">CertPREP Training Center Dashboard </h3>
      </div>
      <div className="header-rigth d-flex align-items-center">
        <a href="/">
          <i className="fa-regular fa-circle-question icon" />
        </a>
        <a href="/">
          <span className="icon">
            <FontAwesomeIcon icon={faEarthAmericas} />
          </span>
        </a>
        <Dropdown className="dropdown-user">
          <Dropdown.Toggle variant="success" id="dropdown-basic-1">
            <i className="fa-regular fa-user icon" />
            {userName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              href={`${config.ACCOUNT_PROFILE_URL}/${authenticatedUser.username}`}
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
