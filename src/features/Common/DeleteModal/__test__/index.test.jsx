import React from 'react';
import '@testing-library/jest-dom';

import { renderWithProviders } from 'test-utils';

import DeleteModal from 'features/Common/DeleteModal';

describe('Delete modal', () => {
  it('Should render the modal', () => {
    const { getByText } = renderWithProviders(
      <DeleteModal
        isOpen
        onClose={false}
        textModal="This action will delete this"
        handleDelete={() => {}}
        labelDeleteButton="Delete Button"
        title="Delete modal"
      />,
    );

    expect(getByText('Delete modal')).toBeInTheDocument();
    expect(getByText('This action will delete this')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
    expect(getByText('Delete Button')).toBeInTheDocument();
  });
});
