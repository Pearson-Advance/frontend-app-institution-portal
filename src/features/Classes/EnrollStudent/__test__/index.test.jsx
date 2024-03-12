import React from 'react';
import { IntlProvider } from 'react-intl';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import EnrollStudent from 'features/Classes/EnrollStudent';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ courseId: 'Demo course', classId: 'demo class' })),
}));

jest.mock('features/Students/data/api', () => ({
  handleEnrollments: jest.fn(() => Promise.resolve()),
}));

describe('EnrollStudent', () => {
  test('Should render with correct elements', () => {
    const { getByText, getByPlaceholderText } = render(
      <IntlProvider locale="en">
        <EnrollStudent isOpen onClose={() => {}} />
      </IntlProvider>,
    );

    expect(getByText('Invite student to enroll')).toBeInTheDocument();
    expect(getByText('Class: demo class')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter email of the student to enroll')).toBeInTheDocument();
    expect(getByText('Send invite')).toBeInTheDocument();
  });

  test('Should handle form submission and shows success toast', async () => {
    const onCloseMock = jest.fn();

    const { getByPlaceholderText, getByText } = render(
      <IntlProvider locale="en">
        <EnrollStudent isOpen onClose={onCloseMock} />
      </IntlProvider>,
    );

    const emailInput = getByPlaceholderText('Enter email of the student to enroll');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = getByText('Send invite');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText('Email invite has been sent successfully')).toBeInTheDocument();
    });
  });
});
