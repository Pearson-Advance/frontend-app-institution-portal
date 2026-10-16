import React from 'react';
import { fireEvent } from '@testing-library/react';
import { Sidebar } from 'features/Main/Sidebar';
import { renderWithProviders } from 'test-utils';
import { getConfig } from '@edx/frontend-platform';
import * as paragonTopaz from 'react-paragon-topaz';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockHistoryPush,
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    INSTRUCTOR_PORTAL_PATH: 'https://instructor.example.com',
  })),
}));

jest.mock('react-paragon-topaz', () => ({
  ...jest.requireActual('react-paragon-topaz'),
  getUserRoles: jest.fn(() => (['INSTITUTION_ADMIN'])),
}));

const defaultInitialState = {
  main: {
    activeTab: 'dashboard',
    selectedInstitution: {},
  },
};

describe('Sidebar', () => {
  test('should render properly', () => {
    const { getByRole } = renderWithProviders(
      <Sidebar />,
      { preloadedState: defaultInitialState },
    );

    const studentsTabButton = getByRole('button', { name: /students/i });
    expect(studentsTabButton).toBeInTheDocument();

    fireEvent.click(studentsTabButton);
    expect(studentsTabButton).toHaveClass('active');

    expect(mockHistoryPush).toHaveBeenCalledWith('/students');
  });

  test('should render Instructor Portal item if has role', () => {
    paragonTopaz.getUserRoles.mockReturnValue(['INSTRUCTOR', 'INSTITUTION_ADMIN']);

    const { getByText } = renderWithProviders(
      <Sidebar />,
      { preloadedState: defaultInitialState },
    );

    const portalLink = getByText('Instructor Portal');
    expect(portalLink).toBeInTheDocument();
  });

  test('should use institution supportLink for Contact Support when provided', () => {
    const customSupportLink = 'https://custom-support.example.com';
    const { getByText } = renderWithProviders(
      <Sidebar />,
      {
        preloadedState: {
          ...defaultInitialState,
          main: {
            ...defaultInitialState.main,
            selectedInstitution: { supportLink: customSupportLink },
          },
        },
      },
    );

    const contactSupportLink = getByText('Contact Support').closest('a');
    expect(contactSupportLink).toHaveAttribute('href', customSupportLink);
  });

  test('should use default Contact Support link when institution has no supportLink', () => {
    const defaultSupportLink = 'mailto:pearsonskillingsupport@pearson.com';
    const { getByText } = renderWithProviders(
      <Sidebar />,
      { preloadedState: defaultInitialState },
    );

    const contactSupportLink = getByText('Contact Support').closest('a');
    expect(contactSupportLink).toHaveAttribute('href', defaultSupportLink);
  });

  test('hides Offering nav items when the feature is disabled', () => {
    getConfig.mockReturnValue({ INSTRUCTOR_PORTAL_PATH: '' });

    const { queryByText } = renderWithProviders(
      <Sidebar />,
      {
        preloadedState: {
          main: { activeTab: 'dashboard', selectedInstitution: { hasOfferings: true } },
        },
      },
    );

    expect(queryByText('Programs')).not.toBeInTheDocument();
    expect(queryByText('Sessions')).not.toBeInTheDocument();
  });

  test('does not show Offering nav items when the flag is on but institution lacks offerings', () => {
    getConfig.mockReturnValue({ PSS_ENABLE_OFFERINGS: true });

    const { queryByText } = renderWithProviders(
      <Sidebar />,
      {
        preloadedState: {
          main: { activeTab: 'dashboard', selectedInstitution: { hasOfferings: false } },
        },
      },
    );

    expect(queryByText('Programs')).not.toBeInTheDocument();
    expect(queryByText('Sessions')).not.toBeInTheDocument();
  });

  test('shows Offering nav items when the flag is on and institution has offerings', () => {
    getConfig.mockReturnValue({ PSS_ENABLE_OFFERINGS: true });

    const { getByText } = renderWithProviders(
      <Sidebar />,
      {
        preloadedState: {
          main: { activeTab: 'dashboard', selectedInstitution: { hasOfferings: true } },
        },
      },
    );

    expect(getByText('Programs')).toBeInTheDocument();
    expect(getByText('Sessions')).toBeInTheDocument();
  });

  test('navigates to the offerings routes when the feature is enabled', () => {
    getConfig.mockReturnValue({ PSS_ENABLE_OFFERINGS: true });

    const { getByText } = renderWithProviders(
      <Sidebar />,
      {
        preloadedState: {
          main: { activeTab: 'dashboard', selectedInstitution: { hasOfferings: true } },
        },
      },
    );

    fireEvent.click(getByText('Programs'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/offerings');

    fireEvent.click(getByText('Sessions'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/offering-runs');
  });
});
