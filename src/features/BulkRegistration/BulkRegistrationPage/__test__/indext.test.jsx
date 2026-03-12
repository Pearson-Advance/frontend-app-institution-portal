/* eslint-disable react/prop-types */
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  screen, fireEvent, act,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { getConfig } from '@edx/frontend-platform';

import { renderWithProviders } from 'test-utils';
import BulkRegister from 'features/BulkRegistration/BulkRegistrationPage';

jest.mock('@edx/paragon', () => {
  const actual = jest.requireActual('@edx/paragon');

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

jest.mock('features/BulkRegistration/data/api', () => ({
  postBulkRegister: jest.fn((file) => {
    if (file.name === 'students.csv') {
      return Promise.resolve({
        data: {
          errors: {
            summary: {
              total_rows: '8', created: '8', existed: '0', failed: '0',
            },
          },
          rows: [],
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
          },
          rows: [],
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
        },
        rows: [],
      },
    });
  }),
}));

const makeFile = (name, type = 'text/csv') => new File(['first_name,last_name\nJohn,Doe'], name, { type });

let renderResult;

const renderComponent = () => {
  renderResult = renderWithProviders(
    <MemoryRouter initialEntries={['/students/bulk-registration']}>
      <Route path="/students/bulk-registration">
        <BulkRegister />
      </Route>
    </MemoryRouter>,
    {
      preloadedState: {
        main: {
          selectedInstitution: {
            hasBulkRegister: true,
          },
        },
      },
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
  renderComponent();
});

afterEach(() => {
  act(() => { jest.runAllTimers(); });
  jest.useRealTimers();
  jest.clearAllMocks();
});

describe('Initial load', () => {
  test('Should render the Bulk Register title and subtitle', () => {
    expect(screen.getByText('Bulk Register')).toBeInTheDocument();
    expect(screen.getByText('Upload a CSV to register multiple students at once')).toBeInTheDocument();
  });

  test('Should display all required column chips', () => {
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

describe('File selection', () => {
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

describe('Success', () => {
  test('Should show the full success screen when all registrations succeed', async () => {
    await selectFileAndSubmit(makeFile('students.csv'));
    expect(screen.getByText('All registrations successful!')).toBeInTheDocument();
    expect(screen.getByText(/successfully registered all 8 students/i)).toBeInTheDocument();
  });

  test('Should show the partial success summary with correct stat labels', async () => {
    await selectFileAndSubmit(makeFile('partial.csv'));
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Total rows')).toBeInTheDocument();
    expect(screen.getByText('Already existed')).toBeInTheDocument();
    expect(screen.getByText('Created Successfully')).toBeInTheDocument();
  });

  test('Should display the correct numeric values in the partial success stat cards', async () => {
    await selectFileAndSubmit(makeFile('partial.csv'));
    // total_rows=8, existed=2, created=6
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });
});

describe('Error', () => {
  test('Should show the error state with the failed rows description', async () => {
    await selectFileAndSubmit(makeFile('error.csv'));
    expect(screen.getByText(/we detected errors in your data/i)).toBeInTheDocument();
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

  test('Should return to the idle upload form after clicking Upload Another', async () => {
    await selectFileAndSubmit(makeFile('error.csv'));
    fireEvent.click(screen.getByRole('button', { name: /upload another/i }));
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

describe('Navigation', () => {
  test('Should keep the Back to Students button visible after a successful upload', async () => {
    await selectFileAndSubmit(makeFile('students.csv'));
    expect(screen.getByRole('link', { name: /back to students/i })).toBeInTheDocument();
  });

  test('Should keep the Back to Students button visible on the fatal error screen', async () => {
    await selectFileAndSubmit(makeFile('fatal.csv'));
    expect(screen.getByRole('link', { name: /back to students/i })).toBeInTheDocument();
  });
});

describe('Redirect', () => {
  test('Should redirect to /students when hasBulkRegister is false', () => {
    const { container } = renderWithProviders(
      <MemoryRouter initialEntries={['/students/bulk-registration']}>
        <Route path="/students/bulk-registration">
          <BulkRegister />
        </Route>
        <Route path="/students">
          <div>Students page</div>
        </Route>
      </MemoryRouter>,
      {
        preloadedState: {
          main: { selectedInstitution: { hasBulkRegister: false } },
        },
      },
    );
    expect(container).toHaveTextContent('Students page');
  });

  test('Should redirect to /students when PSS_ENABLE_BULK_REGISTRATION is false', () => {
    getConfig.mockReturnValue({ PSS_ENABLE_BULK_REGISTRATION: false });

    const { container } = renderWithProviders(
      <MemoryRouter initialEntries={['/students/bulk-registration']}>
        <Route path="/students/bulk-registration">
          <BulkRegister />
        </Route>
        <Route path="/students">
          <div>Students page</div>
        </Route>
      </MemoryRouter>,
      {
        preloadedState: {
          main: { selectedInstitution: { hasBulkRegister: true } },
        },
      },
    );
    expect(container).toHaveTextContent('Students page');
  });
});
