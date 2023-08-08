import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Sidebar } from 'features/Main/Sidebar';
import '@testing-library/jest-dom/extend-expect';

describe('Sidebar', () => {
  it('should render properly', () => {
    const onClickTab = jest.fn();
    const activeTab = 'students';

    const { getByRole } = render(
      <Sidebar onClickTab={onClickTab} activeTab={activeTab} />,
    );

    const studentsTabButton = getByRole('button', { name: /students/i });
    expect(studentsTabButton).toBeInTheDocument();
    expect(studentsTabButton).toHaveClass('active');

    const instructorsTabButton = getByRole('button', { name: /instructors/i });
    expect(instructorsTabButton).toBeInTheDocument();
    expect(instructorsTabButton).not.toHaveClass('active');

    fireEvent.click(studentsTabButton);
    expect(onClickTab).toHaveBeenCalledWith('students');

    fireEvent.click(instructorsTabButton);
    expect(onClickTab).toHaveBeenCalledWith('instructors');
  });

  it('should render properly', () => {
    const onClickTab = jest.fn();
    const activeTab = 'instructors';

    const { getByRole } = render(
      <Sidebar onClickTab={onClickTab} activeTab={activeTab} />,
    );

    const studentsTabButton = getByRole('button', { name: /students/i });
    expect(studentsTabButton).not.toHaveClass('active');

    const instructorsTabButton = getByRole('button', { name: /instructors/i });
    expect(instructorsTabButton).toHaveClass('active');

    fireEvent.click(studentsTabButton);
    expect(onClickTab).toHaveBeenCalledWith('students');

    fireEvent.click(instructorsTabButton);
    expect(onClickTab).toHaveBeenCalledWith('instructors');
  });
});
