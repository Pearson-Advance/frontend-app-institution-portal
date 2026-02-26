import React, { useContext } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import { Dropdown } from '@openedx/paragon';
import { Header as HeaderBase } from 'react-paragon-topaz';

export const Header = () => {
  const { authenticatedUser } = useContext(AppContext);
  const displayName = authenticatedUser?.name || authenticatedUser.username;
  const questionsLink = () => `${getConfig().HEADER_QUESTIONS_LINK}`;
  const platformName = getConfig().PLATFORM_NAME ? getConfig().PLATFORM_NAME : 'Pearson Skilling Administrator';

  return (
    <HeaderBase
      title={platformName}
      src={`${getConfig().LOGO_INSTITUTION_PORTAL}`}
      logoUrl={`${getConfig().LMS_BASE_URL}`}
    >
      <div className="header-right d-flex align-items-center">
        <a href={questionsLink()}>
          <i className="fa-regular fa-circle-question icon" />
        </a>
        <Dropdown className="dropdown-user">
          <Dropdown.Toggle variant="success" id="dropdown-basic-1">
            <i className="fa-regular fa-user icon" />
            {displayName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              href={`${getConfig().ACCOUNT_PROFILE_URL}/u/${authenticatedUser.username}`}
            >
              Profile
            </Dropdown.Item>
            <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/logout`}>Log Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </HeaderBase>
  );
};
