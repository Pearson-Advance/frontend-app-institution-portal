/* eslint-disable react/prop-types, no-nested-ternary */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

import { Button } from 'react-paragon-topaz';
import AssignInstructors from 'features/Instructors/AssignInstructors';
import {
  Dropdown, IconButton, Icon, useToggle,
} from '@edx/paragon';
import AddClass from 'features/Courses/AddClass';
import { MoreHoriz } from '@edx/paragon/icons';

import { updateClassSelected } from 'features/Instructors/data/slice';
import { fetchClassesData } from 'features/Classes/data/thunks';

import { initialPage } from 'features/constants';

const columns = [
  {
    Header: 'Class',
    accessor: 'className',
    Cell: ({ row }) => (
      <Link
        to={`/courses/${row.values.masterCourseName}/${row.values.className}?classId=${row.original.classId}`}
        className="text-truncate link"
      >
        {row.values.className}
      </Link>
    ),
  },
  {
    Header: 'Course',
    accessor: 'masterCourseName',
  },
  {
    Header: 'Start Date',
    accessor: 'startDate',
    Cell: ({ row }) => (row.values.startDate ? format(row.values.startDate, 'MM/dd/yy') : ''),
  },
  {
    Header: 'End Date',
    accessor: 'endDate',
    Cell: ({ row }) => (row.values.endDate ? format(row.values.endDate, 'MM/dd/yy') : ''),
  },
  {
    Header: 'Min',
    accessor: 'minStudentsAllowed',
  },
  {
    Header: 'Students Enrolled',
    accessor: 'numberOfStudents',
  },
  {
    Header: 'Max',
    accessor: 'maxStudents',
  },
  {
    Header: 'Instructors',
    accessor: 'instructors',
    Cell: ({ row }) => {
      const [isModalOpen, setIsModalOpen] = useState(false);

      const dispatch = useDispatch();
      const institution = useSelector((state) => state.main.selectedInstitution);

      const handleOpenModal = () => {
        dispatch(updateClassSelected(row.original.classId));
        setIsModalOpen(true);
      };

      const handleCloseModal = () => {
        dispatch(fetchClassesData(institution.id, initialPage));
        setIsModalOpen(false);
      };

      if (row.values.instructors?.length > 0) {
        return (
          <ul className="instructors-list mb-0">
            {row.values.instructors.map(instructor => <li key={instructor} className="text-truncate">{`${instructor}`}</li>)}
          </ul>
        );
      }
      return (
        <>
          <Button onClick={handleOpenModal} className="button-assign">
            <i className="fa fa-plus mr-2" />
            Assign
          </Button>
          <AssignInstructors
            isOpen={isModalOpen}
            close={handleCloseModal}
            getClasses={false}
          />
        </>
      );
    },
  },
  {
    Header: '',
    accessor: 'courseName',
    cellClassName: 'dropdownColumn',
    disableSortBy: true,
    Cell: ({ row }) => {
      const [isOpenModal, openModal, closeModal] = useToggle(false);
      return (
        <Dropdown className="dropdowntpz">
          <Dropdown.Toggle
            id="dropdown-toggle-with-iconbutton"
            as={IconButton}
            src={MoreHoriz}
            iconAs={Icon}
            variant="primary"
            data-testid="droprown-action"
            alt="menuAction"
          />
          <Dropdown.Menu>
            <Dropdown.Item onClick={openModal}>
              <i className="fa-solid fa-arrow-up-right-from-square mr-2 mb-1" />
              Edit Class
            </Dropdown.Item>
            <AddClass
              isOpen={isOpenModal}
              onClose={closeModal}
              courseInfo={{
                masterCourseName: row.original.masterCourseName,
                masterCourseId: row.original.masterCourseId,
                classId: row.original.classId,
                className: row.original.className,
                startDate: row.original.startDate,
                endDate: row.original.endDate,
                minStudents: row.original.minStudentsAllowed,
                maxStudents: row.original.maxStudents,
              }}
              isCoursePage
              isEdit
            />
          </Dropdown.Menu>
        </Dropdown>
      );
    },
  },
];

export { columns };
