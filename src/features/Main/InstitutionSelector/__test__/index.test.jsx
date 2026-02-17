import React from 'react';
import { Router } from 'react-router-dom';
import { fireEvent } from '@testing-library/react';

import InstitutionSelector from 'features/Main/InstitutionSelector';
import { renderWithProviders } from 'test-utils';

jest.mock('react-select', () => function reactSelect({ options, currentValue, onChange }) {
  function handleChange(event) {
    onChange({ id: event.currentTarget.value });

    return event;
  }

  return (
    <select data-testid="select" value={currentValue} onChange={handleChange}>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
});

describe('InstitutionSelector', () => {
  let history;

  beforeEach(() => {
    history = {
      location: { search: '' },
      push: jest.fn(),
      replace: jest.fn(),
      listen: jest.fn(),
      createHref: jest.fn(),
    };
  });

  test('Should render the select options and handle selection', () => {
    const preloadedState = {
      main: {
        institution: {
          data: [
            { id: 1, name: 'Institution 1' },
            { id: 2, name: 'Institution 2' },
          ],
        },
        selectedInstitution: null,
      },
    };

    const { getByText, getByTestId } = renderWithProviders(
      <Router history={history}>
        <InstitutionSelector />
      </Router>,
      { preloadedState },
    );

    expect(getByText('Select an institution')).toBeInTheDocument();

    fireEvent.change(getByTestId('select'), { target: { value: '1', id: '1' } });

    expect(getByText('Institution 1')).toBeInTheDocument();
  });
});
