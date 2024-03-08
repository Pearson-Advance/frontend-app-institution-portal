/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';

import { Badge, Button } from 'react-paragon-topaz';
import AssignInstructors from 'features/Instructors/AssignInstructors';

import { fetchClassesData } from 'features/Classes/data/thunks';
import { updateClassSelected } from 'features/Instructors/data/slice';

import { initialPage } from 'features/constants';

const columns = [
  {
    Header: 'Class',
    accessor: 'className',
    Cell: ({ row }) => {
      const { courseId } = useParams();
      return (<Link to={`/courses/${courseId}/${row.values.className}`} className="text-truncate link">{row.values.className}</Link>);
    },
  },
  {
    Header: 'Instructor',
    accessor: 'instructors',
    Cell: ({ row }) => {
      const { courseId } = useParams();
      const [isModalOpen, setIsModalOpen] = useState(false);

      const dispatch = useDispatch();
      const institution = useSelector((state) => state.main.selectedInstitution);

      const handleOpenModal = () => {
        dispatch(updateClassSelected(row.original.classId));
        setIsModalOpen(true);
      };

      const handleCloseModal = () => {
        dispatch(fetchClassesData(institution.id, initialPage, courseId));
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
    Header: 'Enrollment status',
    accessor: 'numberOfPendingStudents',
    Cell: ({ row }) => {
      const isEnrollmentComplete = row.values.numberOfPendingStudents === 0;

      return isEnrollmentComplete ? (
        <Badge variant="success" light>Complete</Badge>
      ) : (
        <Badge variant="warning" light>Pending ({row.values.numberOfPendingStudents})</Badge>
      );
    },
  },
  {
    Header: 'Min',
    accessor: 'minStudentsAllowed',
  },
  {
    Header: 'Students Enrolled',
    accessor: 'numberOfStudents',
    Cell: ({ row }) => (
      <span>
        {row.values.numberOfStudents}
      </span>
    ),
  },
  {
    Header: 'Max',
    accessor: 'maxStudents',
  },
  {
    Header: 'Start date',
    accessor: 'startDate',
    Cell: ({ row }) => (row.values.startDate ? format(row.values.startDate, 'MM/dd/yy') : '-'),
  },
  {
    Header: 'End date',
    accessor: 'endDate',
    Cell: ({ row }) => (row.values.endDate ? format(row.values.endDate, 'MM/dd/yy') : '-'),
  },
];

export { columns };
