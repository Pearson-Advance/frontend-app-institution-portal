/* eslint-disable react/prop-types, no-nested-ternary */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

import { Button } from 'react-paragon-topaz';
import AssignInstructors from 'features/Instructors/AssignInstructors';

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
];

export { columns };
