import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Pagination } from '@edx/paragon';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';

import Table from 'features/Main/Table';
import InstructorCard from 'features/Classes/InstructorCard';
import Actions from 'features/Classes/Class/ClassPage/Actions';
import { Button } from 'react-paragon-topaz';

import { updateActiveTab } from 'features/Main/data/slice';
import { getColumns } from 'features/Classes/Class/ClassPage/columns';
import { resetStudentsTable, updateCurrentPage } from 'features/Students/data/slice';
import { fetchStudentsData, fetchStudentsVouchers } from 'features/Students/data';

import {
  initialPage,
  RequestStatus,
  VOUCHER_STATUS,
  VOUCHER_RULE_TYPES,
  VOUCHER_RULES,
} from 'features/constants';
import { resetClassesTable, resetClasses } from 'features/Classes/data/slice';
import { fetchAllClassesData } from 'features/Classes/data/thunks';

import { useInstitutionIdQueryParam } from 'hooks';

import 'features/Classes/Class/ClassPage/index.scss';

const ClassPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId, classId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const previousPage = queryParams.get('previous') || 'classes';
  const courseIdDecoded = decodeURIComponent(courseId);
  const classIdDecoded = decodeURIComponent(classId);

  const institutionRef = useRef(undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const institution = useSelector((state) => state.main.selectedInstitution);
  const students = useSelector((state) => state.students.table);
  const vouchers = useSelector((state) => state.students.vouchers?.results || []);
  const addQueryParam = useInstitutionIdQueryParam();

  const isLoadingStudents = students.status === RequestStatus.LOADING;

  const enableVoucherColumn = getConfig().PSS_ENABLE_ASSIGN_VOUCHER || false;

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  const defaultClassInfo = useMemo(() => ({
    className: '',
  }), []);

  const classInfo = useSelector((state) => state.classes.allClasses.data)
    .find((classElement) => classElement?.classId === classIdDecoded) || defaultClassInfo;

  const displayVoucherOptions = classInfo.examSeriesCode;

  /*
    TODO: Currently, it is not allowed to assign a voucher with the same exam_series_code
    to a user in more than one institution. When this restriction is lifted, this logic
    will need to be updated to support multiple vouchers with the same exam_series_code
    across different institutions.
  */
  const groupUserVouchersByInstitution = (apiVouchers, userId, currentInstitutionUuid) => {
    const userVouchers = apiVouchers.filter(v => v.user === userId);

    const sameInstitution = userVouchers.find(
      v => v.institutionUuid === currentInstitutionUuid,
    );

    const otherInstitution = userVouchers.find(
      v => v.institutionUuid !== currentInstitutionUuid,
    );

    return { sameInstitution, otherInstitution };
  };

  const determineVoucherRule = (sameInstitution, otherInstitution) => {
    if (!sameInstitution && !otherInstitution) {
      return VOUCHER_RULE_TYPES.NO_VOUCHER;
    }

    if (sameInstitution) {
      if (sameInstitution.status === VOUCHER_STATUS.AVAILABLE) {
        return VOUCHER_RULE_TYPES.SAME_AVAILABLE;
      }
      if (sameInstitution.status === VOUCHER_STATUS.REVOKED) {
        return VOUCHER_RULE_TYPES.SAME_REVOKED;
      }
    }

    if (otherInstitution) {
      if (otherInstitution.status === VOUCHER_STATUS.AVAILABLE) {
        return VOUCHER_RULE_TYPES.OTHER_AVAILABLE;
      }
      if (otherInstitution.status === VOUCHER_STATUS.REVOKED) {
        return VOUCHER_RULE_TYPES.OTHER_REVOKED;
      }
    }

    return VOUCHER_RULE_TYPES.DEFAULT;
  };

  const selectVoucherForDisplay = (sameInstitution, otherInstitution, ruleKey) => {
    if (ruleKey === VOUCHER_RULE_TYPES.SAME_AVAILABLE
      || ruleKey === VOUCHER_RULE_TYPES.SAME_REVOKED) {
      return sameInstitution;
    }

    return sameInstitution || otherInstitution || null;
  };

  const createVoucherInfo = (selectedVoucher, ruleKey) => {
    const ruleConfig = VOUCHER_RULES[ruleKey];

    return {
      ...selectedVoucher,
      ...ruleConfig,
    };
  };

  const mergeStudentsWithVouchers = () => {
    if (!students?.data?.length) {
      return [];
    }

    if (!vouchers?.length) {
      return students.data.map(student => ({
        ...student,
        voucherInfo: createVoucherInfo(null, VOUCHER_RULE_TYPES.NO_VOUCHER),
      }));
    }

    if (!institution?.uuid) {
      return students.data.map(student => ({
        ...student,
        voucherInfo: createVoucherInfo(null, VOUCHER_RULE_TYPES.DEFAULT),
      }));
    }

    return students.data.map(student => {
      const { sameInstitution, otherInstitution } = groupUserVouchersByInstitution(
        vouchers,
        student.userId,
        institution.uuid,
      );

      const ruleKey = determineVoucherRule(sameInstitution, otherInstitution);
      const selectedVoucher = selectVoucherForDisplay(sameInstitution, otherInstitution, ruleKey);
      const voucherInfo = createVoucherInfo(selectedVoucher, ruleKey);

      return {
        ...student,
        voucherInfo,
      };
    });
  };

  const COLUMNS = useMemo(() => (
    getColumns({ displayVoucherOptions, enableVoucherColumn })
  ), [displayVoucherOptions, enableVoucherColumn]);

  useEffect(() => {
    const initialTitle = document.title;

    document.title = classIdDecoded;
    // Leaves a gap time space to prevent being override by ActiveTabUpdater component
    setTimeout(() => dispatch(updateActiveTab('classes')), 100);

    return () => {
      document.title = initialTitle;
    };
  }, [dispatch, classIdDecoded]);

  useEffect(() => {
    if (institution.id) {
      const params = {
        course_id: courseIdDecoded,
        class_id: classIdDecoded,
        limit: true,
      };

      dispatch(fetchStudentsData(institution.id, currentPage, params));

      if (displayVoucherOptions) {
        dispatch(fetchStudentsVouchers(displayVoucherOptions));
      }
    }

    return () => {
      dispatch(resetStudentsTable());
      dispatch(updateCurrentPage(initialPage));
    };
  }, [dispatch, institution.id, courseIdDecoded, classIdDecoded, currentPage, displayVoucherOptions]);

  useEffect(() => {
    if (institution.id) {
      dispatch(fetchAllClassesData(institution.id, courseIdDecoded));
    }

    return () => {
      dispatch(resetClassesTable());
      dispatch(resetClasses());
    };
  }, [dispatch, institution.id, courseIdDecoded]);

  useEffect(() => {
    if (institution.id !== undefined && institutionRef.current === undefined) {
      institutionRef.current = institution.id;
    }

    if (institution.id !== institutionRef.current) {
      navigate(addQueryParam('/courses'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institution, navigate]);

  return (
    <Container size="xl" className="px-4 mt-3">
      <div className="d-flex justify-content-between mb-3 flex-column flex-sm-row">
        <div className="d-flex align-items-center mb-3">
          <Button onClick={() => navigate(-1)} className="mr-3 link back-arrow" variant="tertiary">
            <i className="fa-solid fa-arrow-left" />
          </Button>
          <h3 className="h2 mb-0 course-title">Class details: {classInfo.className}</h3>
        </div>
      </div>

      <div className="class-wrapper">
        <InstructorCard />
        <div>
          <div className="d-flex justify-content-end my-3 flex-wrap">
            <Actions previousPage={previousPage} />
          </div>
          <Table
            isLoading={isLoadingStudents}
            columns={COLUMNS}
            count={students.count}
            data={mergeStudentsWithVouchers()}
            text="No students were found for this class."
          />
          {students.numPages > 1 && (
          <Pagination
            paginationLabel="paginationNavigation"
            pageCount={students.numPages}
            currentPage={currentPage}
            onPageSelect={handlePagination}
            variant="reduced"
            className="mx-auto pagination-table"
            size="small"
          />
          )}
        </div>
      </div>
    </Container>
  );
};

export default ClassPage;
