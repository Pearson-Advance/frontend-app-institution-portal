import { getConfig } from '@edx/frontend-platform';
import React from 'react';
import './index.scss';

export const Footer = () => {
  const privacyPolicyLink = () => `${getConfig().FOOTER_PRIVACY_POLICY_LINK}`;
  const termsOfServiceLink = () => `${getConfig().FOOTER_TERMS_OF_SERVICE_LINK}`;

  return (
    <footer>
      <ul className="footer-links">
        <li>
          <a href={privacyPolicyLink()}>
            Privacy Policy
          </a>
        </li>
        <li>
          <a href={termsOfServiceLink()}>
            Terms of Service
          </a>
        </li>
      </ul>
    </footer>
  );
};
