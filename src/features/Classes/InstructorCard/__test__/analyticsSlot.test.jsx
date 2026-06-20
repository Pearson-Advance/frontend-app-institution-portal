import { Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';

import InstructorCard from 'features/Classes/InstructorCard';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const basePath = `/courses/${encodeURIComponent(
  'course-v1:XXX+YYY+2023',
)}/${encodeURIComponent('ccx-v1')}`;

const stateMock = {
  main: {
    selectedInstitution: {
      id: 1,
    },
  },
  instructors: {
    selectOptions: {
      data: [],
    },
  },
  classes: {
    allClasses: {
      data: [{
        startDate: '2024-02-13T17:42:22Z',
        classId: 'ccx-v1',
        className: 'demo class',
        masterCourseName: 'Demo course',
        instructors: [],
        numberOfStudents: 2,
        numberOfPendingStudents: 1,
        maxStudents: 5,
      }],
    },
  },
};

describe('InstructorCard analytics slot', () => {
  test('renders children inside the class details card', () => {
    const { getByText } = renderWithProviders(
      <Route
        path="/courses/:courseId/:classId"
        element={(
          <InstructorCard>
            <section>Class overview</section>
          </InstructorCard>
        )}
      />,
      {
        preloadedState: stateMock,
        initialEntries: [basePath],
      },
    );

    expect(getByText('Demo course')).toBeInTheDocument();
    expect(getByText('Class overview')).toBeInTheDocument();
  });
});
