/* eslint-disable react/prop-types, func-names */
import { fireEvent, waitFor } from '@testing-library/react';

import { columns } from 'features/Programs/ProgramsTable/columns';
import { renderWithProviders } from 'test-utils';

jest.mock('@openedx/paragon', () => {
  /* eslint-disable no-shadow, global-require */
  const React = require('react');

  const Dropdown = ({ children }) => <div>{children}</div>;

  Dropdown.Toggle = function ({ children, ...props }) {
    return (
      <button type="button" {...props}>
        {children}
      </button>
    );
  };

  Dropdown.Menu = function ({ children }) {
    return <div>{children}</div>;
  };

  Dropdown.Item = function ({ children, as: As, ...props }) {
    if (As) {
      return <As {...props}>{children}</As>;
    }
    return (
      <button type="button" {...props}>
        {children}
      </button>
    );
  };

  return {
    Dropdown,
    IconButton: ({
      iconAs, as, src, ...props
    }) => <button type="button" {...props} />,
    Icon: () => <span />,
    useToggle: (initial = false) => {
      const [value, setValue] = React.useState(initial);
      return [value, () => setValue(true), () => setValue(false)];
    },
  };
});

jest.mock('features/Sessions/AddSessionModal', () => function ({ isOpen }) {
  return isOpen ? <div data-testid="add-session-modal" /> : null;
});

describe('ProgramsTable columns', () => {
  const programRow = {
    original: {
      id: 1,
      name: 'Cloud Practitioner Program',
      coursesCount: 3,
      runsCount: 2,
    },
    values: { name: 'Cloud Practitioner Program' },
  };

  test('maps the offering list fields to the program, courses and sessions columns', () => {
    const accessors = columns.map((column) => [column.Header, column.accessor]);

    expect(accessors).toEqual(expect.arrayContaining([
      ['Programs', 'name'],
      ['Courses', 'coursesCount'],
      ['Sessions', 'runsCount'],
    ]));
    expect(columns.find((column) => column.Header === 'Students enrolled')).toBeUndefined();
  });

  test('action menu exposes create a session', () => {
    const actionsColumn = columns.find((column) => column.id === 'actions');
    const ActionsCell = actionsColumn.Cell;

    const component = renderWithProviders(<ActionsCell row={programRow} />);

    expect(component.getByText('Create a session')).toBeInTheDocument();
  });

  test('clicking create a session opens the modal', async () => {
    const actionsColumn = columns.find((column) => column.id === 'actions');
    const ActionsCell = actionsColumn.Cell;

    const component = renderWithProviders(<ActionsCell row={programRow} />);

    fireEvent.click(component.getByTestId('create-session-action'));

    await waitFor(() => {
      expect(component.getByTestId('add-session-modal')).toBeInTheDocument();
    });
  });
});
