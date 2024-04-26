import React from 'react';
import { useDispatch } from 'react-redux';
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { updateActiveTab } from 'features/Main/data/slice';
import ActiveTabUpdater from 'features/Main/ActiveTabUpdater';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

describe('ActiveTabUpdater', () => {
  beforeEach(() => {
    useDispatch.mockClear();
  });

  test('Should dispatch updateActiveTab action on mount', () => {
    const dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);

    render(
      <ActiveTabUpdater path="/test">
        <div>Child component</div>
      </ActiveTabUpdater>,
    );

    const childComponent = screen.getByText('Child component');
    expect(dispatchMock).toHaveBeenCalledWith(updateActiveTab('test'));
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(childComponent).toBeInTheDocument();
  });

  test('Should dispatch updateActiveTab with default value', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);

    render(
      <ActiveTabUpdater>
        <div>Child component</div>
      </ActiveTabUpdater>,
    );

    const childComponent = screen.getByText('Child component');
    expect(dispatchMock).toHaveBeenCalledWith(updateActiveTab('dashboard'));
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(childComponent).toBeInTheDocument();
  });
});
