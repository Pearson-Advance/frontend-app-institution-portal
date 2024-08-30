import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UnauthorizedPage from 'features/Main/UnauthorizedPage';

import { unauthorizedText } from 'features/constants';

describe('Unauthorized Component', () => {
  test('should render message', async () => {
    const { container } = render(<UnauthorizedPage />);

    expect(container).toHaveTextContent(unauthorizedText);
  });
});
