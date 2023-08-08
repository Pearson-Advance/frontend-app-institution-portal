import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Main from 'features/Main';
import '@testing-library/jest-dom/extend-expect';

// Test will change when all the components are done

jest.mock('features/Main/Header', () => ({
  // eslint-disable-next-line react/prop-types
  Header: ({ isAccountMenuOpen, setIsAccountMenuOpen }) => (
    <div data-testid="mocked-header">
      Mocked Header - isAccountMenuOpen: {isAccountMenuOpen.toString()}
      <button type="button" onClick={() => setIsAccountMenuOpen(true)}>Open Account Menu</button>
    </div>
  ),
}));

describe('Main component', () => {
  it('renders the Main component with mocked Header', () => {
    const { getByText, getByTestId } = render(<Main />);

    expect(getByText('Students Content')).toBeInTheDocument();

    const mockedHeader = getByTestId('mocked-header');
    expect(mockedHeader).toBeInTheDocument();

    expect(mockedHeader).toHaveTextContent('Mocked Header - isAccountMenuOpen: false');

    fireEvent.click(getByText('Open Account Menu'));

    expect(mockedHeader).toHaveTextContent('Mocked Header - isAccountMenuOpen: true');
  });

  it('renders the Main component with InstructorsContent when activeTab is "instructors"', () => {
    const { getByText } = render(<Main />);

    fireEvent.click(getByText('Instructors'));

    expect(getByText('Instructors Content')).toBeInTheDocument();
  });
});
