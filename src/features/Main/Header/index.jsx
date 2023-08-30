import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import React, { useContext, useState, useEffect, useReducer } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import './index.scss';
import { logError } from '@edx/frontend-platform/logging';

const initialState = {
  data: [],
  status: 'success',
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, status: 'loading' };
    case 'FETCH_SUCCESS':
      return { ...state, status: 'success', data: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, status: 'error', error: action.payload };
    default:
      return state;
  }
};

export const Header = () => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const handleAccountMenuToggle = () => {
    setIsAccountMenuOpen((prevState) => !prevState);
  };
  const { authenticatedUser, config } = useContext(AppContext);
  const usernameFirstLetter = authenticatedUser.username.charAt(0).toUpperCase();

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });

      try {
        const response = await getAuthenticatedHttpClient().get(
          `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/institutions/`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data.results });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE', payload: error });
      }
    };

    fetchData();
  }, []);

  const institutionName = () => {
    try {
      return state.data[0]?.name
    } catch (error) {
      logError(error);
    }
  };

  return (
    <header>
      <div className="institution-name">
        {state.data.length > 1 ? (
          <h3>Global Admin</h3>
        ) : (
          <h3>{institutionName()}</h3>
        )
        }
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
