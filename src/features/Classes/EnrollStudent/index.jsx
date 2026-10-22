import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { logError } from '@edx/frontend-platform/logging';
import EnrollModal from 'features/Common/EnrollModal';

import { handleEnrollments, getMessages } from 'features/Students/data/api';
import { studentsApi } from 'features/Students/data/studentsApi';
import { classesApi, useGetClassesByCourseQuery } from 'features/Classes/data/classesApi';

import 'features/Classes/EnrollStudent/index.scss';

const EnrollStudent = ({
  isOpen,
  onClose,
  customClassId,
  classNameDisplay,
}) => {
  const dispatch = useDispatch();

  const { courseId, classId } = useParams();
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const institution = useSelector((state) => state.main.selectedInstitution);
  const courseIdDecoded = decodeURIComponent(courseId);
  const classIdDecoded = decodeURIComponent(classId);

  const defaultClassInfo = useMemo(() => ({
    className: '',
  }), []);

  const { data: classesByCourse = [] } = useGetClassesByCourseQuery(
    { institutionId: institution.id, courseId: courseIdDecoded },
    { skip: !institution.id || !courseId },
  );

  const classInfo = classesByCourse
    .find((classElement) => classElement?.classId === classIdDecoded) || defaultClassInfo;

  const handleEnrollStudent = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const { studentEmail } = Object.fromEntries(formData.entries());

    formData.delete('studentEmail');
    formData.append('identifiers', studentEmail);
    formData.append('action', 'enroll');
    formData.append('auto_enroll', 'true');
    formData.append('email_students', 'true');

    try {
      setLoading(true);
      const response = await handleEnrollments(formData, customClassId || classIdDecoded);
      const validationEmailList = response?.data?.results;
      const messages = await getMessages();
      const validEmails = [];
      const invalidEmails = [];
      let textToast = '';

      /**
       * This is because the service that checks the enrollment status is a different
       * endpoint, and that endpoint always returns a status 200, so the error cannot be
       * caught with a .catch.
       */
      if (messages?.data?.results[0]?.tags === 'error') {
        setToastMessage(decodeURIComponent(messages?.data?.results[0]?.message));
        setShowToast(true);

        return onClose();
      }

      validationEmailList.forEach(({ invalidIdentifier, identifier }) => {
        (invalidIdentifier ? invalidEmails : validEmails).push(identifier);
      });

      if (invalidEmails.length > 0) {
        textToast = `The following email ${invalidEmails.length === 1
          ? 'adress is invalid'
          : 'adresses are invalid'}:\n${invalidEmails.join('\n')}\n`;
      }
      if (validEmails.length > 0) {
        textToast += `Successfully enrolled and sent email to the following ${validEmails.length === 1
          ? 'user'
          : 'users'}:\n${validEmails.join('\n')}`;
      }

      setToastMessage(textToast);

      dispatch(studentsApi.util.invalidateTags(['StudentsClass']));

      dispatch(classesApi.util.invalidateTags(['Classes']));

      setShowToast(true);
      return onClose();
    } catch (error) {
      return logError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EnrollModal
      isOpen={isOpen}
      onClose={onClose}
      subtitleLabel="Class"
      subtitleValue={classInfo.className || classNameDisplay}
      onSubmit={handleEnrollStudent}
      isLoading={isLoading}
      showToast={showToast}
      setShowToast={setShowToast}
      toastMessage={toastMessage}
    />
  );
};

EnrollStudent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  customClassId: PropTypes.string,
  classNameDisplay: PropTypes.string,
};

EnrollStudent.defaultProps = {
  customClassId: '',
  classNameDisplay: '',
};
export default EnrollStudent;
