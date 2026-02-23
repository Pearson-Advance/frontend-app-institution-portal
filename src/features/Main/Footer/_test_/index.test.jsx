import { render, screen } from '@testing-library/react';
import { Footer } from 'features/Main/Footer';

describe('Footer Component', () => {
  it('should render without crashing', () => {
    render(<Footer />);

    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  it('should render two footer links', () => {
    render(<Footer />);

    const linkElements = screen.getAllByRole('link');
    expect(linkElements).toHaveLength(2);
  });
});
