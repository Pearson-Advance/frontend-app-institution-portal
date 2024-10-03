/* eslint-disable react/prop-types, no-nested-ternary */
import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useDispatch, useSelector } from 'react-redux';

import { Badge } from 'react-paragon-topaz';
import {
  Dropdown, IconButton, Icon, useToggle,
} from '@edx/paragon';
import { MoreHoriz } from '@edx/paragon/icons';

import AddClass from 'features/Courses/AddClass';
import LinkWithQuery from 'features/Main/LinkWithQuery';
import { updateCurrentPage as updateCoursesCurrentPage } from 'features/Courses/data/slice';
import { fetchCoursesData } from 'features/Courses/data/thunks';
import { initialPage } from 'features/constants';

const columns = [
  {
    Header: 'Courses',
    accessor: 'masterCourseName',
    Cell: ({ row }) => (<LinkWithQuery to={`/courses/${encodeURIComponent(row.original.masterCourseId)}`} className="link">{row.values.masterCourseName}</LinkWithQuery>),
  },
  {
    Header: 'Classes',
    accessor: 'numberOfClasses',
  },
  {
    Header: 'Instructor',
    accessor: 'missingClassesForInstructor',
    Cell: ({ row }) => (
      row.values.missingClassesForInstructor > 0
        ? <Badge variant="danger" light>Missing ({row.values.missingClassesForInstructor})</Badge>
        : <Badge variant="success" light>Ready</Badge>
    ),
  },
  {
    Header: 'Students Enrolled',
    accessor: 'numberOfStudents',
  },
  {
    Header: 'Students invited',
    accessor: 'numberOfPendingStudents',
  },
  {
    Header: '',
    accessor: 'className',
    cellClassName: 'dropdownColumn',
    disableSortBy: true,
    Cell: ({ row }) => {
      const dispatch = useDispatch();
      const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
      const [isOpenModal, openModal, closeModal] = useToggle(false);
      const courseDetailsLink = `${getConfig().LEARNING_MICROFRONTEND_URL}/course/${row.original.masterCourseId}/home`;
      const finalCall = () => {
        dispatch(fetchCoursesData(selectedInstitution.id, initialPage));
        dispatch(updateCoursesCurrentPage(initialPage));
      };

      return (
        <Dropdown className="dropdowntpz">
          <Dropdown.Toggle
            id="dropdown-toggle-with-iconbutton"
            as={IconButton}
            src={MoreHoriz}
            iconAs={Icon}
            variant="primary"
            data-testid="droprown-action"
            alt="menu for action"
          />
          <Dropdown.Menu>
            <Dropdown.Item href={courseDetailsLink} target="_blank" rel="noopener noreferrer">
              <i className="fa-solid fa-arrow-up-right-from-square mr-2 mb-1" />
              Course Details
            </Dropdown.Item>
            <Dropdown.Item onClick={openModal}>
              <i className="fa-solid fa-plus mr-2 mb-1" />
              Add Class
            </Dropdown.Item>
            <AddClass
              isOpen={isOpenModal}
              onClose={closeModal}
              courseInfo={{
                masterCourseName: row.original.masterCourseName,
                masterCourseId: row.original.masterCourseId,
              }}
              finalCall={finalCall}
            />
          </Dropdown.Menu>
        </Dropdown>
      );
    },
  },
];

export { columns };
