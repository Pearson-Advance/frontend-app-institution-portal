import React from 'react';
import axios from 'axios';
import {
  render,
  waitFor,
} from '@testing-library/react';
import InstructorsPage from 'features/Instructors/InstructorsPage';
import '@testing-library/jest-dom/extend-expect';

jest.mock('axios');

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockResponse = {
  data: {
    results: [
      {
        instructorUsername: 'Instructor1',
        instructorName: 'Instructor 1',
        instructorEmail: 'instructor1@example.com',
        ccxId: 'CCX1',
        ccxName: 'CCX 1',
      },
      {
        instructorUsername: 'Instructor2',
        instructorName: 'Instructor 2',
        instructorEmail: 'instructor2@example.com',
        ccxId: 'CCX2',
        ccxName: 'CCX 2',
      },
    ],
    count: 2,
    num_pages: 1,
    current_page: 1,
  },
};

describe('InstructorPage', () => {
  test('render instructor page', () => {
    axios.get.mockResolvedValue(mockResponse);

    const component = render(<InstructorsPage />);

    waitFor(() => {
      expect(component.container).toHaveTextContent('Instructor1');
      expect(component.container).toHaveTextContent('Instructor2');
      expect(component.container).toHaveTextContent('Instructor 1');
      expect(component.container).toHaveTextContent('Instructor 2');
      expect(component.container).toHaveTextContent('instructor1@example.com');
      expect(component.container).toHaveTextContent('instructor2@example.com');
      expect(component.container).toHaveTextContent('CCX1');
      expect(component.container).toHaveTextContent('CCX 2');
    });
  });
});
