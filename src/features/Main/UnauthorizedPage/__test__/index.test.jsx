import React from 'react';
import { render, screen } from '@testing-library/react';

import UnauthorizedPage from 'features/Main/UnauthorizedPage';

describe('UnauthorizedPage', () => {
  test('Should render unauthorized page message', () => {
    render(<UnauthorizedPage />);

    expect(screen.getByText(/Administrative access to the Pearson Skilling Suite/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /pearsonskillingsupport@pearson.com/i })).toHaveAttribute(
      'href',
      'mailto:pearsonskillingsupport@pearson.com',
    );
  });
});
