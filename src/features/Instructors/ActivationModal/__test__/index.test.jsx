import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ActivationModal from 'features/Instructors/ActivationModal';

import { deactivationMessage } from 'features/constants';

describe('Activation modal', () => {
  test('should render modal', () => {
    const { getByText } = render(
      <ActivationModal
        isOpen
        onClose={() => {}}
        handleDeactivateStatus={() => {}}
      />,
    );

    expect(getByText('Confirm deactivation')).toBeInTheDocument();
    expect(getByText(deactivationMessage)).toBeInTheDocument();
  });
});
