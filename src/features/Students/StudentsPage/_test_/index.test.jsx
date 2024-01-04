import React from 'react';
import axios from 'axios';
import StudentsPage from 'features/Students/StudentsPage';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { initializeStore } from 'store';

let store;

jest.mock('axios');

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockResponse = {
  data: {
    results: [
      {
        learnerName: 'Student 1',
        learnerEmail: 'student1@example.com',
        courseId: '1',
        courseName: 'course 1',
        classId: '1',
        className: 'class 1',
        instructors: ['Instructor 1'],
        created: 'Fri, 25 Aug 2023 19:01:22 GMT',
        firstAccess: 'Fri, 25 Aug 2023 19:01:23 GMT',
        lastAccess: 'Fri, 25 Aug 2023 20:20:22 GMT',
        status: 'Active',
        examReady: true,
      },
      {
        learnerName: 'Student 2',
        learnerEmail: 'student2@example.com',
        courseId: '2',
        courseName: 'course 2',
        classId: '2',
        className: 'class 2',
        instructors: ['Instructor 2'],
        created: 'Sat, 26 Aug 2023 19:01:22 GMT',
        firstAccess: 'Sat, 26 Aug 2023 19:01:24 GMT',
        lastAccess: 'Sat, 26 Aug 2023 21:22:22 GMT',
        status: 'Pending',
        examReady: null,
      },
    ],
    count: 2,
    num_pages: 1,
    current_page: 1,
  },
};

describe('StudentsPage', () => {
  beforeEach(() => {
    store = initializeStore();
  });

  it('renders students data and pagination', async () => {
    axios.get.mockResolvedValue(mockResponse);

    const component = render(
      <Provider store={store}>
        <StudentsPage />
      </Provider>,
    );

    waitFor(() => {
      expect(component.container).toHaveTextContent('Student 1');
      expect(component.container).toHaveTextContent('Student 2');
      expect(component.container).toHaveTextContent('course 1');
      expect(component.container).toHaveTextContent('course 2');
      expect(component.container).toHaveTextContent('class 1');
      expect(component.container).toHaveTextContent('class 2');
      expect(component.container).toHaveTextContent('Instructor 1');
      expect(component.container).toHaveTextContent('Instructor 2');
      expect(component.container).toHaveTextContent('active');
      expect(component.container).toHaveTextContent('pending');
    });
  });
});
