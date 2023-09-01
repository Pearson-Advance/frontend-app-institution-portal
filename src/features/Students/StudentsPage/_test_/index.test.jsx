import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import StudentsPage from 'features/Students/StudentsPage';

jest.mock('axios');

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('StudentsPage', () => {
  it('renders students data and pagination', async () => {
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

    axios.get.mockResolvedValue(mockResponse);

    render(<StudentsPage />);

    waitFor(() => {
      expect(screen.getByText('Student 1')).toBeInTheDocument();
      expect(screen.getByText('Student 2')).toBeInTheDocument();
      expect(screen.getByText('student1@example.com')).toBeInTheDocument();
      expect(screen.getByText('student2@example.com')).toBeInTheDocument();
      expect(screen.getByText('CCX 1')).toBeInTheDocument();
      expect(screen.getByText('CCX 2')).toBeInTheDocument();
      expect(screen.getByText('Instructor 1')).toBeInTheDocument();
      expect(screen.getByText('Instructor 2')).toBeInTheDocument();
      expect(screen.getByText('Fri, 25 Aug 2023 19:01:22 GMT')).toBeInTheDocument();
      expect(screen.getByText('Sat, 26 Aug 2023 19:01:22 GMT')).toBeInTheDocument();
    });
  });
});
