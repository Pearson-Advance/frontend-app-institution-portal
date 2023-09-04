import React from 'react';
import axios from 'axios';
import StudentsPage from 'features/Students/StudentsPage';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

jest.mock('axios');

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockResponse = {
  data: {
    results: [
      {
        learner_name: 'Student 1',
        learner_email: 'student1@example.com',
        ccx_name: 'CCX 1',
        instructors: ['Instructor 1'],
        created: 'Fri, 25 Aug 2023 19:01:22 GMT',
      },
      {
        learner_name: 'Student 2',
        learner_email: 'student2@example.com',
        ccx_name: 'CCX 2',
        instructors: ['Instructor 2'],
        created: 'Sat, 26 Aug 2023 19:01:22 GMT',
      },
    ],
    count: 2,
    num_pages: 1,
    current_page: 1,
  },
};

describe('StudentsPage', () => {
  it('renders students data and pagination', async () => {
    axios.get.mockResolvedValue(mockResponse);

    const component = render(<StudentsPage />);

    waitFor(() => {
      expect(component.container).toHaveTextContent('Student 1');
      expect(component.container).toHaveTextContent('Student 2');
      expect(component.container).toHaveTextContent('student1@example.com');
      expect(component.container).toHaveTextContent('student2@example.com');
      expect(component.container).toHaveTextContent('CCX 1');
      expect(component.container).toHaveTextContent('CCX 2');
      expect(component.container).toHaveTextContent('Instructor 1');
      expect(component.container).toHaveTextContent('Instructor 2');
      expect(component.container).toHaveTextContent('Fri, 25 Aug 2023 19:01:22 GMT');
      expect(component.container).toHaveTextContent('Sat, 26 Aug 2023 19:01:22 GMT');
    });
  });

  it('filters students data', async () => {
    axios.get.mockResolvedValue(mockResponse);

    const component = render(<StudentsPage />);

    fireEvent.click(screen.getByRole('button', { name: /Filters/i }));

    const nameInput = screen.getByPlaceholderText('Enter Student Name');
    const emailInput = screen.getByPlaceholderText('Enter Student Email');
    fireEvent.change(nameInput, { target: { value: 'Student 1' } });
    fireEvent.change(emailInput, { target: { value: 'student1@example.com' } });

    fireEvent.click(screen.getByText('Apply Filters'));

    waitFor(() => {
      expect(component.container).toHaveTextContent('Student 1');
      expect(screen.queryByText('Student 2')).toBeNull();
    });
  });
});
