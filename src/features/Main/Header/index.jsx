import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import React, {
  useContext, useState, useEffect, useReducer,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RequestStatus } from 'features/constants';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { getInstitutionName } from 'features/Main/Header/data/api';
import './index.scss';

const initialState = {
  data: [],
  status: RequestStatus.SUCCESS,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, status: RequestStatus.LOADING };
    case 'FETCH_SUCCESS':
      return { ...state, status: RequestStatus.SUCCESS, data: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, status: RequestStatus.ERROR, error: action.payload };
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
        const response = await getInstitutionName();
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE', payload: error });
      }
    };

    fetchData();
  }, []);

  return (
    <header>
      <div className="institution-name">
        {state.data.length >= 1 ? (
          <h3>Global Admin</h3>
        ) : (
          <h3>{state.data.results ? state.data.results[0].name : 'No Institution Found'}</h3>
        )}
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
