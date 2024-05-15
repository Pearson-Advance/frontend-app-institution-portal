import React from 'react';
import { Footer as FooterBase, ItemLink } from 'react-paragon-topaz';
import { getConfig } from '@edx/frontend-platform';

export const Footer = () => {
  const privacyPolicyLink = () => `${getConfig().FOOTER_PRIVACY_POLICY_LINK}`;
  const termsOfServiceLink = () => `${getConfig().FOOTER_TERMS_OF_SERVICE_LINK}`;
  const currentYear = new Date().getFullYear();
  const copyRightText = `Copyright ${currentYear} Pearson Education Inc. or its affiliate(s). All rights reserved.`;

  return (
    <FooterBase
      copyright={copyRightText}
    >
      <ItemLink
        label="Terms"
        href={termsOfServiceLink()}
        target="_blank"
        rel="noopener noreferrer"
      />
      <ItemLink
        label="Privacy"
        href={privacyPolicyLink()}
        target="_blank"
        rel="noopener noreferrer"
      />
    </FooterBase>
  );
};
