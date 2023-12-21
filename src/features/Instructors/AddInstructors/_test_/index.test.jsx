import React from 'react';
import axios from 'axios';
import { render, fireEvent, act } from '@testing-library/react';
import AddInstructors from 'features/Instructors/AddInstructors';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { initializeStore } from 'store';

let store;

jest.mock('axios');

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockResponse = {
  data: [
    {
      classId: 'CCX1',
      className: 'CCX 1',
      masterCourseName: 'Master1',
    },
    {
      classId: 'CCX2',
      className: 'CCX 2',
      masterCourseName: 'Master2',
    },
  ],
};

describe('Add instructor component', () => {
  beforeEach(() => {
    store = initializeStore();
  });

  test('Render and load modal', async () => {
    axios.get.mockResolvedValue(mockResponse);

    const { getByText } = render(
      <Provider store={store}>
        <AddInstructors />
      </Provider>,
    );
    const button = getByText('Add Instructor');
    await act(async () => {
      fireEvent.click(button);
    });

    /* const instructorInfoInput = getByPlaceholderText('Enter Username or Email of the instructor');
    const ccxSelect = getByText('Select Class Name');
    expect(instructorInfoInput).toBeInTheDocument();
    expect(ccxSelect).toBeInTheDocument();

    fireEvent.change(instructorInfoInput, { target: { value: 'Name' } });
    const submitButton = getByText('Add');
    await act(async () => {
      fireEvent.click(submitButton);
    }); */
  });
});
