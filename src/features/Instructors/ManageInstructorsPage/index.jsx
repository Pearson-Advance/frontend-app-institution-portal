import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useLocation } from 'react-router-dom';

import { Container, Toast } from '@edx/paragon';
import ListInstructors from 'features/Instructors/ManageInstructorsPage/ListInstructors';
import AssignSection from 'features/Instructors/ManageInstructorsPage/AssignSection';
import { Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';

import { RequestStatus } from 'features/constants';
import { resetClassesTable, resetClasses } from 'features/Classes/data/slice';
import { fetchAllClassesData } from 'features/Classes/data/thunks';
import { updateFilters, resetRowSelect } from 'features/Instructors/data/slice';
import { assignInstructors } from 'features/Instructors/data';

import 'features/Instructors/ManageInstructorsPage/index.scss';

const ManageInstructorsPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const cancelButtonRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const classes = useSelector((state) => state.classes.allClasses);
  const rowsSelected = useSelector((state) => state.instructors.rowsSelected);
  const { courseName, className } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const classId = queryParams.get('classId')?.replaceAll(' ', '+');
  const isLoading = classes?.status === RequestStatus.LOADING;
  const isButtonDisabled = rowsSelected.length === 0;

  const [classInfo] = classes.data.filter(
    (classElement) => classElement.classId === classId,
  );

  const resetValues = () => {
    cancelButtonRef?.current?.clearSelectionFunc();
    dispatch(updateFilters({}));
    dispatch(resetRowSelect());
  };

  const handleAssignInstructors = async () => {
    try {
      const instructorsData = rowsSelected.map(row => ({
        unique_student_identifier: row,
        rolename: 'staff',
        action: 'allow',
        class_id: classId,
      }));

      const enrollmentData = {
        instructors: [
          ...instructorsData,
        ],
      };

      await dispatch(assignInstructors(enrollmentData));
      dispatch(fetchAllClassesData(selectedInstitution.id, courseName));
      if (rowsSelected.length === 1) {
        setToastMessage(`${rowsSelected[0]} has been successfully assigned to Class ${className}`);
      } else if (rowsSelected.length > 1) {
        setToastMessage(`${rowsSelected.join()} have been successfully assigned to Class ${className}`);
      }
      setShowToast(true);
    } catch (error) {
      logError(error);
    } finally {
      resetValues();
    }
  };

  useEffect(() => {
    if (selectedInstitution.id) {
      dispatch(fetchAllClassesData(selectedInstitution.id, courseName));
    }

    return () => {
      dispatch(resetClassesTable());
      dispatch(resetClasses());
    };
  }, [dispatch, selectedInstitution.id, courseName]);

  return (
    <>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
      >
        {toastMessage}
      </Toast>
      <Container size="xl" className="px-4 mt-3 manage-instructors-page">
        <div className="d-flex justify-content-between mb-3 flex-column flex-sm-row">
          <div className="d-flex align-items-center mb-3">
            <Link to="/instructors" className="mr-3 link">
              <i className="fa-solid fa-arrow-left" />
            </Link>
            <h3 className="h2 mb-0 course-title">Manage Instructors</h3>
          </div>
        </div>
        <div className="d-flex flex-column mb-3">
          <h4 className="class-name">{className}</h4>
          <p className="course-name">{courseName}</p>
        </div>
        <ListInstructors instructors={classInfo?.instructors} isLoading={isLoading} />
        <AssignSection ref={cancelButtonRef} />
        <div className="d-flex col-12 justify-content-end align-items-start p-0 mt-4">
          <Button
            variant="tertiary"
            text
            className="mr-2"
            onClick={resetValues}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignInstructors}
            data-testid="assignButton"
            disabled={isButtonDisabled}
          >
            Submit
          </Button>
        </div>
      </Container>
    </>
  );
};

export default ManageInstructorsPage;
