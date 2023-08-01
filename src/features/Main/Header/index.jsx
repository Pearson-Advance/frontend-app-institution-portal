import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import './index.scss';

export const Header = () => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
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
              <FontAwesomeIcon icon={faCaretDown} />
            </span>
          </button>
          {isAccountMenuOpen && (
            <div className="account-menu">
              <ul>
                <li>
                  <a
                    className="nav-link"
                    href={`${config.ACCOUNT_PROFILE_URL}/${authenticatedUser.username}`}
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
