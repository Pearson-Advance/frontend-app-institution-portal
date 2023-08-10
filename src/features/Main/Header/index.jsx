import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ArrowIcon from '../../../assets/images/arrow_icon.svg';
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
              <img src={ArrowIcon} alt="icon" />
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
