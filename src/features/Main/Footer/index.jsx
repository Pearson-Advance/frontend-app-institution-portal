import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import './index.scss';

export const Footer = () => {
  const privacyPolicyLink = () => `${getConfig().FOOTER_PRIVACY_POLICY_LINK}`;
  const termsOfServiceLink = () => `${getConfig().FOOTER_TERMS_OF_SERVICE_LINK}`;
  const currentYear = new Date().getFullYear();

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
      </ul>
      <p className="footer-copyright">Copyright {currentYear} Pearson Education Inc. or its affiliate(s). All rights reserved.</p>
    </footer>
  );
};
