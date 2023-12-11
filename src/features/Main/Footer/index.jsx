import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookieBite, faEarthAmericas } from '@fortawesome/free-solid-svg-icons';
import './index.scss';

export const Footer = () => {
  const privacyPolicyLink = () => `${getConfig().FOOTER_PRIVACY_POLICY_LINK}`;
  const termsOfServiceLink = () => `${getConfig().FOOTER_TERMS_OF_SERVICE_LINK}`;

  return (
    <footer>
      <ul className="footer-links">
        <li className="footer-item">
          <a href={termsOfServiceLink()}>
            Terms
          </a>
        </li>
        <li className="footer-item">
          <a href={privacyPolicyLink()}>
            Privacy
          </a>
        </li>
        <li className="footer-item">
          <span className="icon">
            <FontAwesomeIcon icon={faEarthAmericas} />
          </span>
          <a href={termsOfServiceLink()}>
            English - US
          </a>
        </li>
        <li className="footer-item">
          <span className="icon">
            <FontAwesomeIcon icon={faCookieBite} />
          </span>
          <a href={termsOfServiceLink()}>
            Cookie preferences
          </a>
        </li>
      </ul>
      <p className="footer-copyright">Copyright 2023 Pearson Education Inc. or its affiliate(s). All rights reserved.</p>
    </footer>
  );
};
