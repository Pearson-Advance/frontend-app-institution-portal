import { renderWithProviders } from 'test-utils';
import LinkWithQuery from 'features/Main/LinkWithQuery';

import { INSTITUTION_QUERY_ID } from 'features/constants';

describe('LinkWithQuery', () => {
  test('Should render the link with the URL unchanged if institutionId is not defined', () => {
    const preloadedState = {
      main: {
        selectedInstitution: null,
      },
    };

    const { getByText } = renderWithProviders(
      <LinkWithQuery to="/courses">Test Link</LinkWithQuery>,
      { preloadedState },
    );

    const linkElement = getByText('Test Link');
    expect(linkElement).toHaveAttribute('href', '/courses');
  });

  test('Should render the link with the institutionId as a query param if institutionId is defined', () => {
    const institutionId = '12345';
    const preloadedState = {
      main: {
        selectedInstitution: { id: institutionId },
      },
    };

    const { getByText } = renderWithProviders(
      <LinkWithQuery to="/courses">Test Link</LinkWithQuery>,
      { preloadedState },
    );

    const linkElement = getByText('Test Link');
    expect(linkElement).toHaveAttribute('href', `/courses?${INSTITUTION_QUERY_ID}=${institutionId}`);
  });

  test('Should render the link with the institutionId appended as a query param if other query params exist', () => {
    const institutionId = '12345';
    const preloadedState = {
      main: {
        selectedInstitution: { id: institutionId },
      },
    };

    const { getByText } = renderWithProviders(
      <LinkWithQuery to="/courses?foo=bar">Test Link</LinkWithQuery>,
      { preloadedState },
    );

    const linkElement = getByText('Test Link');
    expect(linkElement).toHaveAttribute('href', `/courses?foo=bar&${INSTITUTION_QUERY_ID}=${institutionId}`);
  });
});
