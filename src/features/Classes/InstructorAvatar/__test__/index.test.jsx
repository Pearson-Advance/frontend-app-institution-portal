import React from 'react';
import { render, screen } from '@testing-library/react';

import InstructorAvatar from 'features/Classes/InstructorAvatar';

describe('InstructorAvatar Component', () => {
  beforeEach(() => {
    // Deactivate to avoid false positive error on test #2
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('Should render with profile image', () => {
    const name = 'Sam Sepiol';
    const profileImage = 'path/to/profile/image.jpg';

    render(<InstructorAvatar profileImage={profileImage} name={name} />);

    const imgElement = screen.getByRole('img');
    expect(imgElement).toHaveAttribute('src', profileImage);
    expect(imgElement).toHaveAttribute('alt', 'Instructor profile');
  });

  test('Should render with initials when no profile image', () => {
    const name = 'Sam Sepiol';

    render(<InstructorAvatar profileImage={null} name={name} />);

    const initialsElement = screen.getByText('SS');
    expect(initialsElement).toBeInTheDocument();
  });

  test('Should has correct title attribute', () => {
    const name = 'Sam Sepiol';

    render(<InstructorAvatar profileImage={null} name={name} />);

    const articleElement = screen.getByTitle(name);
    expect(articleElement).toBeInTheDocument();
  });

  test('Should render default "?" for empty name', () => {
    const name = '';

    render(<InstructorAvatar profileImage={null} name={name} />);

    const initialsElement = screen.getByText('?');
    expect(initialsElement).toBeInTheDocument();
  });
});
