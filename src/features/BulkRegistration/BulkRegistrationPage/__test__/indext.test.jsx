/* eslint-disable react/prop-types */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  screen, fireEvent, act,
} from '@testing-library/react';
import { getConfig } from '@edx/frontend-platform';

import { renderWithProviders } from 'test-utils';
import BulkRegister from 'features/BulkRegistration/BulkRegistrationPage';
import { postBulkRegisterStudents, postBulkRegisterInstructors } from 'features/BulkRegistration/data/api';

jest.mock('@openedx/paragon', () => {
  const actual = jest.requireActual('@openedx/paragon');

  const MockDataTable = ({ columns, data }) => (
    <table data-testid="paragon-datatable">
      <thead>
        <tr>{columns.map((col) => <th key={col.accessor}>{col.Header}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.row}>
            {columns.map((col) => (
              <td key={col.accessor}>
                {col.Cell
                  ? col.Cell({ value: row[col.accessor], row: { original: row } })
                  : row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return { ...actual, DataTable: MockDataTable };
});

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

jest.mock('helpers', () => ({
  validateCSVFile: jest.fn((file) => {
    if (!file.name.endsWith('.csv')) {
      return Promise.reject(new Error('Invalid file type'));
    }
    return Promise.resolve();
  }),
}));

jest.mock('features/BulkRegistration/data/api', () => {
  const mockStudentsHandler = jest.fn((file) => {
    if (file.name === 'students.csv') {
      return Promise.resolve({
        data: {
          errors: {
            summary: {
              total_rows: '8', created: '8', existed: '0', failed: '0',
            },
            rows: [],
          },
        },
      });
    }

    if (file.name === 'partial.csv') {
      return Promise.resolve({
        data: {
          errors: {
            summary: {
              total_rows: '8', created: '6', existed: '2', failed: '0',
            },
            rows: [],
          },
        },
      });
    }

    if (file.name === 'error.csv') {
      return Promise.resolve({
        data: {
          errors: {
            summary: {
              total_rows: '5', created: '2', existed: '0', failed: '3',
            },
            rows: [
              {
                row_number: '2',
                email: 'a@example.com',
                status: 'Validation failed',
                errors: { email: ['Already exists'] },
              },
              {
                row_number: '4',
                email: 'b@example.com',
                status: 'Validation failed',
                errors: { first_name: ['This field is required'] },
              },
              {
                row_number: '6',
                email: 'c@example.com',
                status: 'Processing failed',
                errors: {},
              },
            ],
          },
        },
      });
    }

    if (file.name === 'fatal.csv') {
      const err = Object.assign(new Error('Server error'), {
        response: {
          status: 500,
          data: { detail: 'Internal server error. Please contact support.' },
        },
      });
      return Promise.reject(err);
    }

    return Promise.resolve({
      data: {
        errors: {
          summary: {
            total_rows: '0', created: '0', existed: '0', failed: '0',
          },
          rows: [],
        },
      },
    });
  });

  const mockInstructorsHandler = jest.fn((file) => {
    if (file.name === 'instructors.csv') {
      return Promise.resolve({
        data: {
          summary: {
            total_rows: '5', created: '5', existed: '0', failed: '0',
          },
          rows: [],
        },
      });
    }

    if (file.name === 'instructors_partial.csv') {
      return Promise.resolve({
        data: {
          summary: {
            total_rows: '4', created: '3', existed: '1', failed: '0',
          },
          rows: [],
        },
      });
    }

    if (file.name === 'instructors_error.csv') {
      return Promise.resolve({
        data: {
          summary: {
            total_rows: '3', created: '1', existed: '0', failed: '2',
          },
          rows: [
            {
              row_number: '2',
              email: 'bad.email@example.com',
              status: 'Validation failed',
              errors: { email: ['Invalid email format'] },
            },
            {
              row_number: '3',
              email: 'duplicate@example.com',
              status: 'Validation failed',
              errors: { email: ['Instructor already exists'] },
            },
          ],
        },
      });
    }

    if (file.name === 'fatal.csv') {
      const err = Object.assign(new Error('Server error'), {
        response: {
          status: 500,
          data: { detail: 'Internal server error. Please contact support.' },
        },
      });
      return Promise.reject(err);
    }

    return Promise.resolve({
      data: {
        summary: {
          total_rows: '0', created: '0', existed: '0', failed: '0',
        },
        rows: [],
      },
    });
  });

  return {
    postBulkRegisterStudents: mockStudentsHandler,
    postBulkRegisterInstructors: mockInstructorsHandler,
  };
});

const makeFile = (name, type = 'text/csv') => new File(['first_name,last_name\nJohn,Doe'], name, { type });

let renderResult;

const renderComponent = (initialEntry = '/students/bulk-registration') => {
  renderResult = renderWithProviders(
    <Routes>
      <Route
        path="/students/bulk-registration"
        element={<BulkRegister />}
      />
      <Route
        path="/instructors/bulk-registration"
        element={<BulkRegister />}
      />
      <Route
        path="/students"
        element={<div>Students page</div>}
      />
      <Route
        path="/instructors"
        element={<div>Instructors page</div>}
      />
    </Routes>,
    {
      preloadedState: {
        main: {
          selectedInstitution: {
            id: 'inst-123',
            hasBulkRegister: true,
          },
        },
      },
      initialEntries: [initialEntry],
    },
  );
  return renderResult;
};

const selectFile = (file) => {
  const input = document.querySelector('input[type="file"]');
  fireEvent.change(input, { target: { files: [file] } });
};

const selectFileAndSubmit = async (file) => {
  selectFile(file);
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /upload & process/i }));
    jest.advanceTimersByTime(20);
  });
};

beforeEach(() => {
  getConfig.mockReturnValue({ PSS_ENABLE_BULK_REGISTRATION: true });
  jest.useFakeTimers();
});

afterEach(() => {
  act(() => { jest.runAllTimers(); });
  jest.useRealTimers();
  jest.clearAllMocks();
});

describe('Initial load — Students Context', () => {
  beforeEach(() => {
    renderComponent('/students/bulk-registration');
  });

  test('Should render the Bulk Register title and student subtitle', () => {
    expect(screen.getByText('Bulk Register')).toBeInTheDocument();
    expect(screen.getByText('Upload a CSV to register multiple students at once')).toBeInTheDocument();
  });

  test('Should display all required student column chips', () => {
    ['First name', 'Last name', 'Email', 'Password'].forEach((col) => {
      expect(screen.getByText(col)).toBeInTheDocument();
    });
  });

  test('Should render the upload button disabled when no file is selected', () => {
    expect(screen.getByRole('button', { name: /upload & process/i })).toBeDisabled();
  });

  test('Should show the drop zone hint text when no file has been selected', () => {
    expect(screen.getByText('or drag and drop it here')).toBeInTheDocument();
  });

  test('Should render the Back to Students button', () => {
    expect(screen.getByRole('link', { name: /back to students/i })).toBeInTheDocument();
  });
});

describe('Initial load — Instructors Context', () => {
  beforeEach(() => {
    renderComponent('/instructors/bulk-registration');
  });

  test('Should render the instructor subtitle', () => {
    expect(screen.getByText('Upload a CSV to register multiple instructors at once')).toBeInTheDocument();
  });

  test('Should display required instructor column chips (without Password)', () => {
    ['First name', 'Last name', 'Email'].forEach((col) => {
      expect(screen.getByText(col)).toBeInTheDocument();
    });
    expect(screen.queryByText('Password')).not.toBeInTheDocument();
  });

  test('Should render the Back to Instructors button', () => {
    expect(screen.getByRole('link', { name: /back to instructors/i })).toBeInTheDocument();
  });
});

describe('File selection', () => {
  beforeEach(() => {
    renderComponent('/students/bulk-registration');
  });

  test('Should enable the upload button after a valid CSV file is selected', () => {
    selectFile(makeFile('students.csv'));
    expect(screen.getByRole('button', { name: /upload & process/i })).toBeEnabled();
  });

  test('Should display the selected filename in the drop zone', () => {
    selectFile(makeFile('students.csv'));
    expect(screen.getByText('students.csv')).toBeInTheDocument();
  });

  test('Should update the drop zone hint to indicate the file can be changed after selection', () => {
    selectFile(makeFile('students.csv'));
    expect(screen.getByText('Click to change file')).toBeInTheDocument();
  });

  test('Should not accept files with non-CSV extensions', () => {
    selectFile(makeFile('students.xlsx', 'application/vnd.ms-excel'));
    expect(screen.getByRole('button', { name: /upload & process/i })).toBeDisabled();
  });
});

describe('Loading', () => {
  beforeEach(() => {
    renderComponent('/students/bulk-registration');
  });

  test('Should show the loading screen immediately after clicking Upload & Process', () => {
    selectFile(makeFile('students.csv'));

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /upload & process/i }));
    });

    expect(screen.getByText('Processing your file...')).toBeInTheDocument();
    expect(screen.getByText('This may take a moment')).toBeInTheDocument();

    act(() => { jest.runAllTimers(); });
  });

  test('Should hide the upload form while the file is being processed', () => {
    selectFile(makeFile('students.csv'));

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /upload & process/i }));
    });

    expect(screen.queryByText('Required columns:')).not.toBeInTheDocument();

    act(() => { jest.runAllTimers(); });
  });

  test('Should not render the loading screen after a successful API response', async () => {
    await selectFileAndSubmit(makeFile('students.csv'));
    expect(screen.queryByText('Processing your file...')).not.toBeInTheDocument();
  });

  test('Should not render the loading screen after a fatal API error', async () => {
    await selectFileAndSubmit(makeFile('fatal.csv'));
    expect(screen.queryByText('Processing your file...')).not.toBeInTheDocument();
  });
});

describe('Success — Students', () => {
  beforeEach(() => {
    renderComponent('/students/bulk-registration');
  });

  test('Should show the full success screen when all student registrations succeed', async () => {
    await selectFileAndSubmit(makeFile('students.csv'));
    expect(screen.getByText('All registrations successful!')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      const hasText = (node) => node.textContent.includes('successfully registered all') && node.textContent.includes('8') && node.textContent.includes('students');
      const nodeHasText = hasText(element);
      const childrenDontHaveText = Array.from(element.children).every(child => !hasText(child));
      return nodeHasText && childrenDontHaveText;
    })).toBeInTheDocument();
    expect(postBulkRegisterStudents).toHaveBeenCalledWith(expect.anything(), 'inst-123');
  });

  test('Should show the partial success summary with correct stat labels for students', async () => {
    await selectFileAndSubmit(makeFile('partial.csv'));
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Total rows')).toBeInTheDocument();
    expect(screen.getByText('Already existed')).toBeInTheDocument();
    expect(screen.getByText('Created Successfully')).toBeInTheDocument();
  });

  test('Should display the correct numeric values in the partial success stat cards', async () => {
    await selectFileAndSubmit(makeFile('partial.csv'));
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  test('Should not show the Failed stat card when failed count is zero', async () => {
    await selectFileAndSubmit(makeFile('partial.csv'));
    expect(screen.queryByText('Failed')).not.toBeInTheDocument();
  });
});

describe('Success — Instructors', () => {
  beforeEach(() => {
    renderComponent('/instructors/bulk-registration');
  });

  test('Should call postBulkRegisterInstructors with institutionId and show success screen', async () => {
    await selectFileAndSubmit(makeFile('instructors.csv'));
    expect(postBulkRegisterInstructors).toHaveBeenCalledWith(expect.anything(), 'inst-123');
    expect(screen.getByText('All registrations successful!')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      const hasText = (node) => node.textContent.includes('successfully registered all') && node.textContent.includes('5') && node.textContent.includes('instructors');
      const nodeHasText = hasText(element);
      const childrenDontHaveText = Array.from(element.children).every(child => !hasText(child));
      return nodeHasText && childrenDontHaveText;
    })).toBeInTheDocument();
  });

  test('Should display partial success stats correctly for instructors', async () => {
    await selectFileAndSubmit(makeFile('instructors_partial.csv'));
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

describe('Error — Students', () => {
  beforeEach(() => {
    renderComponent('/students/bulk-registration');
  });

  test('Should show the error state with the failed rows description', async () => {
    await selectFileAndSubmit(makeFile('error.csv'));
    expect(screen.getByText(/we detected errors in your data/i)).toBeInTheDocument();
  });

  test('Should render the summary stat cards alongside the failed rows table', async () => {
    await selectFileAndSubmit(makeFile('error.csv'));
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Total rows')).toBeInTheDocument();
    expect(screen.getByText('Created Successfully')).toBeInTheDocument();
  });

  test('Should show the Failed stat card with the correct count in the error summary', async () => {
    await selectFileAndSubmit(makeFile('error.csv'));
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);
  });

  test('Should render the failed rows table with the correct column headers', async () => {
    await selectFileAndSubmit(makeFile('error.csv'));
    expect(screen.getAllByText(/failed rows/i).length).toBeGreaterThan(0);
    ['ROW', 'EMAIL', 'STATUS', 'MESSAGE'].forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  test('Should display the correct number of failed rows in the table badge', async () => {
    await selectFileAndSubmit(makeFile('error.csv'));
    expect(screen.getByText(/failed rows \(3\)/i)).toBeInTheDocument();
  });

  test('Should render Validation failed and Processing failed status badges', async () => {
    await selectFileAndSubmit(makeFile('error.csv'));
    expect(screen.getAllByText('Validation failed').length).toBeGreaterThan(0);
    expect(screen.getByText('Processing failed')).toBeInTheDocument();
  });

  test('Should return to the idle upload form after clicking Upload a new file', async () => {
    await selectFileAndSubmit(makeFile('error.csv'));
    fireEvent.click(screen.getByRole('button', { name: /Upload a new file/i }));
    expect(screen.getByRole('button', { name: /upload & process/i })).toBeInTheDocument();
  });

  test('Should show the fatal error screen with the generic error message', async () => {
    await selectFileAndSubmit(makeFile('fatal.csv'));
    expect(screen.getByText('Something went wrong processing this file')).toBeInTheDocument();
  });

  test('Should display the fatal error detail message returned by the API', async () => {
    await selectFileAndSubmit(makeFile('fatal.csv'));
    expect(screen.getByText('Internal server error. Please contact support.')).toBeInTheDocument();
  });

  test('Should render the Try again button on the fatal error screen', async () => {
    await selectFileAndSubmit(makeFile('fatal.csv'));
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  test('Should return to the idle upload form after clicking Try again', async () => {
    await selectFileAndSubmit(makeFile('fatal.csv'));
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(screen.getByRole('button', { name: /upload & process/i })).toBeInTheDocument();
  });
});

describe('Error — Instructors', () => {
  beforeEach(() => {
    renderComponent('/instructors/bulk-registration');
  });

  test('Should render error rows table correctly for instructor bulk registration failures', async () => {
    await selectFileAndSubmit(makeFile('instructors_error.csv'));
    expect(screen.getByText(/we detected errors in your data/i)).toBeInTheDocument();
    expect(screen.getByText(/failed rows \(2\)/i)).toBeInTheDocument();
    expect(screen.getByText('bad.email@example.com')).toBeInTheDocument();
    expect(screen.getByText('duplicate@example.com')).toBeInTheDocument();
  });
});

describe('Navigation', () => {
  test('Should keep the Back to Students button visible after a successful student upload', async () => {
    renderComponent('/students/bulk-registration');
    await selectFileAndSubmit(makeFile('students.csv'));
    expect(screen.getByRole('link', { name: /back to students/i })).toBeInTheDocument();
  });

  test('Should keep the Back to Instructors button visible after a successful instructor upload', async () => {
    renderComponent('/instructors/bulk-registration');
    await selectFileAndSubmit(makeFile('instructors.csv'));
    expect(screen.getByRole('link', { name: /back to instructors/i })).toBeInTheDocument();
  });
});

describe('Redirect', () => {
  test('Should redirect to /students when hasBulkRegister is false on student route', () => {
    const { container } = renderWithProviders(
      <Routes>
        <Route
          path="/students/bulk-registration"
          element={<BulkRegister />}
        />
        <Route
          path="/students"
          element={<div>Students page</div>}
        />
      </Routes>,
      {
        preloadedState: {
          main: { selectedInstitution: { hasBulkRegister: false } },
        },
        initialEntries: ['/students/bulk-registration'],
      },
    );
    expect(container).toHaveTextContent('Students page');
  });

  test('Should redirect to /instructors when hasBulkRegister is false on instructor route', () => {
    const { container } = renderWithProviders(
      <Routes>
        <Route
          path="/instructors/bulk-registration"
          element={<BulkRegister />}
        />
        <Route
          path="/instructors"
          element={<div>Instructors page</div>}
        />
      </Routes>,
      {
        preloadedState: {
          main: { selectedInstitution: { hasBulkRegister: false } },
        },
        initialEntries: ['/instructors/bulk-registration'],
      },
    );
    expect(container).toHaveTextContent('Instructors page');
  });

  test('Should redirect to /students when PSS_ENABLE_BULK_REGISTRATION is false', () => {
    getConfig.mockReturnValue({ PSS_ENABLE_BULK_REGISTRATION: false });

    const { container } = renderWithProviders(
      <Routes>
        <Route
          path="/students/bulk-registration"
          element={<BulkRegister />}
        />
        <Route
          path="/students"
          element={<div>Students page</div>}
        />
      </Routes>,
      {
        preloadedState: {
          main: { selectedInstitution: { hasBulkRegister: true } },
        },
        initialEntries: ['/students/bulk-registration'],
      },
    );
    expect(container).toHaveTextContent('Students page');
  });
});
