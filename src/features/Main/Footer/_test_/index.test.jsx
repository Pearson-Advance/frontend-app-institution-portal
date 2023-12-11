import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Footer } from 'features/Main/Footer';

describe('Footer Component', () => {
  it('should render without crashing', async () => {
    render(<Footer />);

    await waitFor(() => {
      const footerElement = screen.getByRole('contentinfo');
      expect(footerElement).toBeInTheDocument();
    });
  });

  it('should render two footer links', async () => {
    render(<Footer />);

    await waitFor(() => {
      const linkElements = screen.getAllByRole('link');
      expect(linkElements).toHaveLength(4);
    });
  });
});
