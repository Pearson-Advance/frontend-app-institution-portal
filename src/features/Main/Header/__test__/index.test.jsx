import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { AppContext } from '@edx/frontend-platform/react';
import { Header } from 'features/Main/Header';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LMS_BASE_URL: 'http://localhost:18000',
    COURSE_OPERATIONS_API_V2_BASE_URL: 'http://localhost:18000/pearson_course_operation/api/v2',
    ACCOUNT_PROFILE_URL: 'https://example.com/profile',
  })),
}));

describe('Header', () => {
  const authenticatedUser = {
    username: 'User',
  };
  const config = {
    ACCOUNT_PROFILE_URL: 'https://example.com/profile',
    LMS_BASE_URL: 'http://localhost:18000',
  };

  test('Should render header correctly with "Institution Name"', async () => {
    let getByText;

    await act(async () => {
      const renderResult = render(
        <AppContext.Provider value={{ authenticatedUser, config }}>
          <Header />
        </AppContext.Provider>,
      );

      getByText = renderResult.getByText;
    });
    expect(getByText('User')).toBeInTheDocument();
  });

  test('Should render header correctly', () => {
    const { getByText } = render(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Header />
      </AppContext.Provider>,
    );

    const titleApp = getByText('Pearson Skilling Administrator');
    const userName = getByText('User');

    expect(userName).toBeInTheDocument();
    expect(titleApp).toBeInTheDocument();
  });

  test('Should toggle account menu on button click', () => {
    const { getByRole, getByText } = render(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Header />
      </AppContext.Provider>,
    );

    const button = getByRole('button');
    fireEvent.click(button);

    const profileLink = getByText('Profile');
    const logOutLink = getByText('Log Out');

    expect(profileLink).toBeInTheDocument();
    expect(logOutLink).toBeInTheDocument();
  });

  test('Should have correct href attributes for the links', () => {
    const { getByText, getByRole } = render(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Header />
      </AppContext.Provider>,
    );

    const menuButton = getByRole('button');
    fireEvent.click(menuButton);
    const profileLink = getByText('Profile');
    const logOutLink = getByText('Log Out');

    expect(profileLink).toHaveAttribute('href', `${config.ACCOUNT_PROFILE_URL}/u/${authenticatedUser.username}`);
    expect(logOutLink).toHaveAttribute('href', `${config.LMS_BASE_URL}/logout`);
  });
});
