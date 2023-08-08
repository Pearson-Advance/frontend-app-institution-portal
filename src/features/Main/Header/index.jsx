import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import './index.scss';

export const Header = ({ isAccountMenuOpen, setIsAccountMenuOpen }) => {
  const handleAccountMenuToggle = () => {
    setIsAccountMenuOpen((prevState) => !prevState);
  };
  const { authenticatedUser, config } = useContext(AppContext);
  const usernameFirstLetter = authenticatedUser.username.charAt(0).toUpperCase();
  return (
    <header>
      <div className="institution-name">
        <h3>Institution</h3>
      </div>
      <div className="actions">
        <div className="account-menu-container">
          <button type="button" className="button-unstyled" aria-expanded={isAccountMenuOpen} onClick={handleAccountMenuToggle}>
            <span className="avatar">{usernameFirstLetter}</span>
            <span className="icon-18">
              <svg xmlnsXlink="http://www.w3.org/1999/xlink" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.99434 7H12.0057C12.5548 7 13 7.44827 13 8.00124C13 8.26845 12.8939 8.52458 12.7054 8.71261L9.69972 11.7101C9.31219 12.0966 8.68781 12.0966 8.30028 11.7101L5.29463 8.71261C4.90445 8.32349 4.90142 7.68955 5.28786 7.29667C5.47461 7.10681 5.72897 7 5.99434 7Z" fill="#020917" />
              </svg>
            </span>
          </button>
          {isAccountMenuOpen && (
            <div className="account-menu hidden">
              <ul>
                <li>
                  <a
                    className="nav-link"
                    href={`${config.ACCOUNT_PROFILE_URL}/u/${authenticatedUser.username}`}
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    className="nav-link"
                    href={`${getConfig().LMS_BASE_URL}/logout`}
                  >
                    Log Out
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  isAccountMenuOpen: PropTypes.bool.isRequired,
  setIsAccountMenuOpen: PropTypes.func.isRequired,
};
