import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
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
  const history = useHistory();
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
  const mergeStudentsWithVouchers = () => {
    if (!students?.data?.length || !vouchers?.length) {
      return students?.data || [];
    }

    const getVoucherRule = (sameInstitution, otherInstitution) => {
      if (!sameInstitution && !otherInstitution) { return VOUCHER_RULE_TYPES.NO_VOUCHER; }

      if (!sameInstitution && otherInstitution?.status === VOUCHER_STATUS.AVAILABLE) {
        return VOUCHER_RULE_TYPES.OTHER_AVAILABLE;
      }

      if (!sameInstitution && otherInstitution?.status === VOUCHER_STATUS.REVOKED) {
        return VOUCHER_RULE_TYPES.OTHER_REVOKED;
      }

      if (sameInstitution?.status === VOUCHER_STATUS.AVAILABLE) { return VOUCHER_RULE_TYPES.SAME_AVAILABLE; }

      if (sameInstitution?.status === VOUCHER_STATUS.REVOKED) { return VOUCHER_RULE_TYPES.SAME_REVOKED; }

      return VOUCHER_RULE_TYPES.DEFAULT;
    };

    const getSelectedVoucher = (sameInstitution, otherInstitution, ruleKey) => {
      if (ruleKey === VOUCHER_RULE_TYPES.SAME_AVAILABLE || ruleKey === VOUCHER_RULE_TYPES.SAME_REVOKED) {
        return sameInstitution;
      }

      return sameInstitution ?? otherInstitution ?? null;
    };

    const mergedData = students.data.map(student => {
      const userVouchers = vouchers.filter(v => v.user === student.userId);

      if (userVouchers.length === 0) {
        return {
          ...student,
          voucherInfo: {
            ...VOUCHER_RULES[VOUCHER_RULE_TYPES.NO_VOUCHER],
          },
        };
      }

      const voucherSameInstitution = userVouchers.find(
        v => v.institutionUuid === institution?.uuid,
      );

      const voucherOtherInstitution = userVouchers.find(
        v => v.institutionUuid !== institution?.uuid,
      );

      const ruleKey = getVoucherRule(voucherSameInstitution, voucherOtherInstitution);
      const selectedVoucher = getSelectedVoucher(voucherSameInstitution, voucherOtherInstitution, ruleKey);

      return {
        ...student,
        voucherInfo: {
          ...selectedVoucher,
          ...VOUCHER_RULES[ruleKey],
        },
      };
    });

    return mergedData;
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
      history.push(addQueryParam('/courses'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institution, history]);

  return (
    <Container size="xl" className="px-4 mt-3">
      <div className="d-flex justify-content-between mb-3 flex-column flex-sm-row">
        <div className="d-flex align-items-center mb-3">
          <Button onClick={() => history.goBack()} className="mr-3 link back-arrow" variant="tertiary">
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
