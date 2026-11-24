/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Dropdown,
  IconButton,
  Icon,
  useToggle,
} from '@openedx/paragon';
import { MoreHoriz } from '@openedx/paragon/icons';
import { logError } from '@edx/frontend-platform/logging';

import AddSessionModal from 'features/Sessions/AddSessionModal';
import LinkWithQuery from 'features/Main/LinkWithQuery';
import { useAddSessionMutation } from 'features/Sessions/data/sessionsApi';
import { programsApi, useGetInstitutionLicensesQuery } from 'features/Programs/data/programsApi';

import { formatUTCDate, buildFilterParams } from 'helpers';

const EMPTY_LICENSE_OPTIONS = [];

const getApiErrorMessage = (error) => {
  const errorData = error?.data;

  if (errorData && typeof errorData === 'object') {
    if (errorData.detail) { return errorData.detail; }
    if (errorData.message) { return errorData.message; }
    if (Array.isArray(errorData.non_field_errors)) {
      return errorData.non_field_errors.join(' ');
    }

    const fieldErrors = Object.entries(errorData)
      .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
      .join('\n');

    if (fieldErrors) { return fieldErrors; }
  }

  return 'An unexpected error occurred while creating the session.';
};

const ProgramActions = ({ row }) => {
  const dispatch = useDispatch();
  const institution = useSelector((state) => state.main.selectedInstitution);

  const { id } = row.original;

  const {
    data: licenseOptions = EMPTY_LICENSE_OPTIONS,
    isLoading: isLoadingLicenses,
    isError: isErrorLicenses,
  } = useGetInstitutionLicensesQuery(
    { institutionId: institution?.id },
    { skip: !institution?.id },
  );

  const [isCreateSessionOpen, openCreateSession, closeCreateSession] = useToggle(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [addSession, { isLoading: isCreatingSession }] = useAddSessionMutation();

  const handleCreateSession = async (formData) => {
    const body = buildFilterParams({
      offering_id: Number(id),
      institution_id: institution?.id,
      license_id: Number(formData.licenseId),
      name: formData.sessionName.trim(),
      start_date: formatUTCDate(formData.startDate, "yyyy-MM-dd'T'00:00:00'Z'"),
    });

    try {
      const result = await addSession(body).unwrap();

      if (result?.status === 'creation_failed') {
        setToastMessage('Session created with issues. Some course classes failed to initialize.');
      } else {
        setToastMessage('Session created successfully.');
      }

      dispatch(programsApi.util.invalidateTags(['ProgramDetail', 'Programs']));
      setShowToast(true);
      return closeCreateSession();
    } catch (error) {
      logError(error);
      setToastMessage(getApiErrorMessage(error));
      setShowToast(true);
      return closeCreateSession();
    }
  };

  return (
    <>
      <Dropdown className="dropdowntpz">
        <Dropdown.Toggle
          id="program-actions-toggle"
          as={IconButton}
          src={MoreHoriz}
          iconAs={Icon}
          variant="primary"
          data-testid="program-action"
          alt="menu for program actions"
        />
        <Dropdown.Menu popperConfig={{ strategy: 'fixed' }}>
          <Dropdown.Item onClick={openCreateSession} data-testid="create-session-action">
            <i className="fa-regular fa-calendar-plus mr-2 mb-1" />
            Create a session
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <AddSessionModal
        isOpen={isCreateSessionOpen}
        onClose={closeCreateSession}
        onSubmit={handleCreateSession}
        isLoading={isCreatingSession}
        showToast={showToast}
        setShowToast={setShowToast}
        toastMessage={toastMessage}
        licenseOptions={licenseOptions}
        isLoadingLicenses={isLoadingLicenses}
        isErrorLicenses={isErrorLicenses}
      />
    </>
  );
};

const columns = [
  {
    Header: '',
    id: 'actions',
    cellClassName: 'dropdownColumn',
    disableSortBy: true,
    Cell: ProgramActions,
  },
  {
    Header: 'Programs',
    accessor: 'name',
    Cell: ({ row }) => (
      <LinkWithQuery
        to={`/programs/${encodeURIComponent(row.original.id)}`}
        className="link"
      >
        {row.original.name}
      </LinkWithQuery>
    ),
  },
  {
    Header: 'Courses',
    accessor: 'coursesCount',
  },
  {
    Header: 'Sessions',
    accessor: 'runsCount',
  },
];

export { columns };
