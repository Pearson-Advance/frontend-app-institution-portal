import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Main from 'features/Main';

describe('Main', () => {
  it('should switch active tab on button click', () => {
    // Render the component
    const { getByText } = render(<Main />);

    // Find the buttons for students and instructors
    const studentsButton = getByText('Students');
    const instructorsButton = getByText('Instructors');

    // Simulate a click on the instructors button
    fireEvent.click(instructorsButton);

    // Assert that the active tab has switched to instructors
    expect(studentsButton).not.toHaveClass('active');
    expect(instructorsButton).toHaveClass('active');

    // Simulate a click on the students button
    fireEvent.click(studentsButton);

    // Assert that the active tab has switched back to students
    expect(studentsButton).toHaveClass('active');
    expect(instructorsButton).not.toHaveClass('active');
  });
});
