import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import { Container, Toast } from '@openedx/paragon';
import { logError } from '@edx/frontend-platform/logging';
import { Button } from 'react-paragon-topaz';
import ListInstructors from 'features/Instructors/ManageInstructors/ListInstructors';
import AssignSection from 'features/Instructors/ManageInstructors/AssignSection';

import { updateFilters, resetRowSelect } from 'features/Instructors/data/slice';
import { assignInstructors } from 'features/Instructors/data';
import { updateActiveTab } from 'features/Main/data/slice';
import { useGetClassesByCourseQuery } from 'features/Classes/data/classesApi';
import { useGetInstructorsOptionsQuery } from 'features/Instructors/data/instructorsApi';

import 'features/Instructors/ManageInstructors/index.scss';

const ManageInstructors = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cancelButtonRef = useRef(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const rowsSelected = useSelector((state) => state.instructors.rowsSelected);

  const { courseId, classId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const previousPage = queryParams.get('previous') || 'courses';
  const isButtonDisabled = rowsSelected.length === 0;
  const classIdDecoded = decodeURIComponent(classId);
  const courseIdDecoded = decodeURIComponent(courseId);

  const defaultClassInfo = useMemo(() => ({
    className: '',
    masterCourseName: '',
  }), []);

  const { data: classesByCourse = [] } = useGetClassesByCourseQuery(
    { institutionId: selectedInstitution.id, courseId: courseIdDecoded },
    { skip: !selectedInstitution.id },
  );

  const {
    data: instructorsByClass = [],
    isFetching: isLoadingInstructors,
  } = useGetInstructorsOptionsQuery(
    { institutionId: selectedInstitution.id, filters: { limit: false, class_id: classIdDecoded } },
    { skip: !selectedInstitution.id },
  );

  const classInfo = classesByCourse
    .find((classElement) => classElement?.classId === classIdDecoded) || defaultClassInfo;

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
        class_id: classIdDecoded,
      }));

      const enrollmentData = {
        instructors: [
          ...instructorsData,
        ],
      };

      await dispatch(assignInstructors(enrollmentData));
      if (rowsSelected.length === 1) {
        setToastMessage(`${rowsSelected[0]} has been successfully assigned to Class ${classInfo.className}`);
      } else if (rowsSelected.length > 1) {
        setToastMessage(`${rowsSelected.join()} have been successfully assigned to Class ${classInfo.className}`);
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
    }
  }, [dispatch, selectedInstitution.id, previousPage]);

  return (
    <>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
      >
        {toastMessage}
      </Toast>
      <Container className="px-5 mt-3 manage-instructors-page">
        <div className="d-flex justify-content-between mb-3 flex-column flex-sm-row">
          <div className="d-flex align-items-center mb-3">
            <Button onClick={() => navigate(-1)} className="mr-3 link back-arrow" variant="tertiary">
              <i className="fa-solid fa-arrow-left" />
            </Button>
            <h3 className="h2 mb-0 course-title">Manage Instructors</h3>
          </div>
        </div>
        <div className="d-flex flex-column mb-3">
          <h4 className="class-name">{classInfo.className}</h4>
          <p className="course-name">{classInfo.masterCourseName}</p>
        </div>
        <ListInstructors instructors={instructorsByClass} isLoadingInstructors={isLoadingInstructors} />
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
