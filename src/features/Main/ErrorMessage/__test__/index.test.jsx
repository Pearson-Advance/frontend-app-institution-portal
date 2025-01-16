import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ErrorMessage from 'features/Main/ErrorMessage';

describe('ErrorMessage Component', () => {
  test('Should render with the default message when no message prop is provided', () => {
    render(<ErrorMessage />);

    const messageElement = screen.getByText('An error occurred, please try again later.');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass('text-danger');
  });

  test('Should render the provided message when message prop is passed', () => {
    const customMessage = 'Custom error message.';
    render(<ErrorMessage message={customMessage} />);

    const messageElement = screen.getByText(customMessage);
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass('text-danger');
  });

  test('Should have the correct layout and styles', () => {
    const customMessage = 'Another error occurred.';
    render(<ErrorMessage message={customMessage} />);

    const container = screen.getByText(customMessage).closest('div');
    expect(container).toHaveClass('d-flex justify-content-center align-items-center');
  });
});
