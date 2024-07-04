import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, useHistory } from 'react-router-dom';

import { Container, Toast } from '@edx/paragon';
import { logError } from '@edx/frontend-platform/logging';
import { Button } from 'react-paragon-topaz';
import ListInstructors from 'features/Instructors/ManageInstructors/ListInstructors';
import AssignSection from 'features/Instructors/ManageInstructors/AssignSection';

import { RequestStatus, initialPage } from 'features/constants';
import { resetClassesTable, resetClasses } from 'features/Classes/data/slice';
import { updateFilters, resetRowSelect } from 'features/Instructors/data/slice';
import { assignInstructors, fetchInstructorsOptionsData } from 'features/Instructors/data';
import { updateActiveTab } from 'features/Main/data/slice';

import 'features/Instructors/ManageInstructors/index.scss';

const ManageInstructors = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const cancelButtonRef = useRef(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const rowsSelected = useSelector((state) => state.instructors.rowsSelected);
  const instructorsByClass = useSelector((state) => state.instructors.selectOptions);

  const { courseName, className } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const classId = queryParams.get('classId')?.replaceAll(' ', '+');
  const previousPage = queryParams.get('previous') || 'courses';
  const isLoadingInstructors = instructorsByClass?.status === RequestStatus.LOADING;
  const isButtonDisabled = rowsSelected.length === 0;
  const courseNameDecoded = decodeURIComponent(courseName);
  const classNameDecoded = decodeURIComponent(className);

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
      dispatch(fetchInstructorsOptionsData(selectedInstitution.id, initialPage, { limit: false, class_id: classId }));
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
      // Leaves a gap time space to prevent being override by ActiveTabUpdater component
      setTimeout(() => dispatch(updateActiveTab(previousPage)), 100);
      dispatch(fetchInstructorsOptionsData(selectedInstitution.id, initialPage, { limit: false, class_id: classId }));
    }

    return () => {
      dispatch(resetClassesTable());
      dispatch(resetClasses());
    };
  }, [dispatch, selectedInstitution.id, previousPage, classId]);

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
            <Button onClick={() => history.goBack()} className="mr-3 link back-arrow" variant="tertiary">
              <i className="fa-solid fa-arrow-left" />
            </Button>
            <h3 className="h2 mb-0 course-title">Manage Instructors</h3>
          </div>
        </div>
        <div className="d-flex flex-column mb-3">
          <h4 className="class-name">{classNameDecoded}</h4>
          <p className="course-name">{courseNameDecoded}</p>
        </div>
        <ListInstructors instructors={instructorsByClass?.data} isLoadingInstructors={isLoadingInstructors} />
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

export default ManageInstructors;
