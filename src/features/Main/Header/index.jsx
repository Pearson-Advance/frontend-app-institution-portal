import React, { useState } from 'react';
import './index.scss';


export const Header = (props) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const handleAccountMenuToggle = () => {
    setIsAccountMenuOpen((prevState) => !prevState);
  };

  return (
    <>
      <header>
          <div className='institution-name'>
            <h3>Institution</h3>
          </div>
          <div className='actions'>
            <div className='account-menu-container'>
              <button className='button-unstyled' aria-expanded={isAccountMenuOpen} onClick={handleAccountMenuToggle}>
                <span className='avatar'>A</span>
                <span className='icon-18'></span>
              </button>
              {isAccountMenuOpen && (
                <div className='account-menu'>
                  <ul>
                    <li>
                      <a>
                        Profile
                      </a>
                    </li>
                    <li>
                      <a>
                        Log Out
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
      </header>
    </>
  );
};
