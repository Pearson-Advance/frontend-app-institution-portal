/* eslint-disable react/prop-types */
import { act, waitFor } from '@testing-library/react';
import { Route } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';

import { renderWithProviders } from 'test-utils';
import ClassPage from 'features/Classes/Class/ClassPage';
import { getSupersetAnalyticsStatus } from 'features/Classes/data/api';
import { useGetClassesByCourseQuery } from 'features/Classes/data/classesApi';
import { useGetStudentsByClassQuery } from 'features/Students/data/studentsApi';

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: jest.fn(),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('features/Classes/data/api', () => ({
  ...jest.requireActual('features/Classes/data/api'),
  getSupersetAnalyticsStatus: jest.fn(),
}));

jest.mock('features/Classes/data/classesApi', () => ({
  ...jest.requireActual('features/Classes/data/classesApi'),
  useGetClassesByCourseQuery: jest.fn(),
}));

jest.mock('features/Students/data/studentsApi', () => ({
  ...jest.requireActual('features/Students/data/studentsApi'),
  useGetStudentsByClassQuery: jest.fn(),
}));

jest.mock('features/Classes/InstructorCard', () => function MockInstructorCard({ children }) {
  return (
    <article data-testid="instructor-card">
      {children && <div data-testid="analytics-overview-slot">{children}</div>}
    </article>
  );
});

jest.mock('features/Classes/ClassAnalyticsWidgets', () => function MockClassAnalyticsWidgets() {
  return <section data-testid="class-analytics-widgets">Class overview</section>;
});

jest.mock('features/Classes/Class/ClassPage/Actions', () => function MockActions() {
  return null;
});

jest.mock('features/Main/Table', () => function MockTable() {
  return null;
});

jest.mock('features/Classes/Class/ClassPage/columns', () => ({
  getColumns: jest.fn(() => []),
}));

const courseId = 'course-v1:PX+CS00002+2023';
const classId = 'ccx-v1:PX+CS00002+2023+ccx@39';
const routePath = '/courses/:courseId/:classId';
const routeUrl = `/courses/${encodeURIComponent(courseId)}/${encodeURIComponent(classId)}`;

const preloadedState = {
  main: {
    selectedInstitution: {
      id: 2,
      uuid: 'c01f9bb2-e8cc-4a42-91f9-acde2a398dc3',
    },
  },
  students: {
    vouchers: {
      results: [],
    },
  },
};

const renderPage = () => renderWithProviders(
  <Route path={routePath} element={<ClassPage />} />,
  {
    preloadedState,
    initialEntries: [routeUrl],
  },
);

describe('ClassPage Superset analytics access gate', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getConfig.mockReturnValue({
      ENABLE_CLASS_ANALYTICS_WIDGETS: true,
      PSS_ENABLE_CLASS_ANALYTICS_WIDGETS: false,
      PSS_ENABLE_ASSIGN_VOUCHER: false,
    });

    useGetClassesByCourseQuery.mockReturnValue({
      data: [{
        classId,
        className: 'Analytics class',
      }],
      isFetching: false,
    });

    useGetStudentsByClassQuery.mockReturnValue({
      data: {
        results: [],
        count: 0,
        numPages: 0,
      },
      isFetching: false,
      refetch: jest.fn(),
    });
  });

  test('does not mount the analytics slot while access is unresolved or denied', async () => {
    let resolveStatus;
    getSupersetAnalyticsStatus.mockReturnValue(new Promise((resolve) => {
      resolveStatus = resolve;
    }));

    const { queryByTestId } = renderPage();

    expect(getSupersetAnalyticsStatus).toHaveBeenCalledTimes(1);
    expect(queryByTestId('analytics-overview-slot')).not.toBeInTheDocument();
    expect(queryByTestId('class-analytics-widgets')).not.toBeInTheDocument();

    await act(async () => {
      resolveStatus({ data: { enabled: false } });
    });

    await waitFor(() => {
      expect(queryByTestId('analytics-overview-slot')).not.toBeInTheDocument();
      expect(queryByTestId('class-analytics-widgets')).not.toBeInTheDocument();
    });
  });

  test('mounts analytics only after the backend confirms access', async () => {
    let resolveStatus;
    getSupersetAnalyticsStatus.mockReturnValue(new Promise((resolve) => {
      resolveStatus = resolve;
    }));

    const { findByTestId, queryByTestId } = renderPage();

    expect(queryByTestId('analytics-overview-slot')).not.toBeInTheDocument();
    expect(queryByTestId('class-analytics-widgets')).not.toBeInTheDocument();

    await act(async () => {
      resolveStatus({ data: { enabled: true } });
    });

    expect(await findByTestId('analytics-overview-slot')).toBeInTheDocument();
    expect(await findByTestId('class-analytics-widgets')).toBeInTheDocument();
  });

  test('does not call the capability endpoint when frontend analytics is disabled', () => {
    getConfig.mockReturnValue({
      ENABLE_CLASS_ANALYTICS_WIDGETS: false,
      PSS_ENABLE_CLASS_ANALYTICS_WIDGETS: false,
      PSS_ENABLE_ASSIGN_VOUCHER: false,
    });

    const { queryByTestId } = renderPage();

    expect(getSupersetAnalyticsStatus).not.toHaveBeenCalled();
    expect(queryByTestId('analytics-overview-slot')).not.toBeInTheDocument();
  });
});
