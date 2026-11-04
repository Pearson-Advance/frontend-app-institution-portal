import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-paragon-topaz';
import { Container, Pagination, Spinner } from '@openedx/paragon';

import Table from 'features/Main/Table';
import LinkWithQuery from 'features/Main/LinkWithQuery';

import { columns, getColumns } from 'features/Licenses/LicenseDetailTable/columns';
import { fetchCoursesData } from 'features/Courses/data/thunks';
import { resetCoursesTable, updateCurrentPage } from 'features/Courses/data/slice';
import { fetchLicensesData } from 'features/Licenses/data';
import { withMockConsumedData, withMockProgramCourses } from 'features/Licenses/data/mocks';

import {
  initialPage, licenseBuyLink, RequestStatus, LICENSE_POOL_TYPES,
} from 'features/constants';
import { useInstitutionIdQueryParam, useProgramsAccess } from 'hooks';

import 'features/Licenses/LicensesDetailPage/index.scss';

const LicensesDetailPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { licenseId } = useParams();
  const addQueryParam = useInstitutionIdQueryParam();

  const institutionRef = useRef(undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const defaultLicenseInfo = {
    licenseName: '-',
    purchasedSeats: '-',
    numberOfStudents: '-',
    numberOfPendingStudents: '-',
    consumed: '-',
  };

  const institution = useSelector((state) => state.main.selectedInstitution);
  const coursesTable = useSelector((state) => state.courses);
  const licenseTable = useSelector((state) => state.licenses.table);
  const licenseInfo = licenseTable.data
    .find((license) => license?.licenseId === parseInt(licenseId, 10)) || defaultLicenseInfo;
  const isLoadingCourses = coursesTable.table.status === RequestStatus.LOADING;
  const isLoadingLicenses = licenseTable.status === RequestStatus.LOADING;

  const showOfferingsData = useProgramsAccess();
  const isProgramType = showOfferingsData && licenseInfo.type === LICENSE_POOL_TYPES.PROGRAM;
  const programCourses = isProgramType
    ? withMockProgramCourses(licenseInfo, coursesTable.table.data)
    : coursesTable.table.data;
  const detailData = isProgramType ? withMockConsumedData(programCourses) : programCourses;
  const detailColumns = isProgramType
    ? getColumns({
      licenseName: licenseInfo.licenseName,
      totalCourses: licenseInfo.numberOfCourses ?? coursesTable.table.count,
      to: `/programs/${licenseInfo.programId ?? ''}`,
    })
    : columns;

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  useEffect(() => {
    if (institution.id) {
      dispatch(fetchCoursesData(institution.id, currentPage, { license_id: licenseId }));
      dispatch(fetchLicensesData(institution.id, initialPage, licenseId));
    }

    return () => {
      dispatch(resetCoursesTable());
    };
  }, [dispatch, institution.id, licenseId, currentPage]);

  useEffect(() => {
    if (institution.id !== undefined && institutionRef.current === undefined) {
      institutionRef.current = institution.id;
    }

    if (institution.id !== institutionRef.current) {
      navigate(addQueryParam('/licenses'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institution, navigate]);

  return (
    <Container className="px-5">
      <div className="d-flex justify-content-between mb-3 flex-column flex-sm-row">
        <div className="d-flex align-items-start mb-3">
          <LinkWithQuery to="/licenses" className="mr-3 mt-2 link">
            <i className="fa-solid fa-arrow-left" />
          </LinkWithQuery>
          <div>
            <h3 className="h2 mb-0 course-title">License pool: {licenseInfo.licenseName}</h3>
            <p>
              {isProgramType
                ? 'Program-type licenses are assigned from this pool'
                : 'Courses for which a license can be used/assigned from this pool.'}
            </p>
          </div>
        </div>
        <div className="card-container d-flex justify-content-around align-items-center">
          {isLoadingLicenses && (
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <Spinner
                animation="border"
                className="mie-3"
                screenReaderText="loading"
              />
            </div>
          )}
          {!isLoadingLicenses && (
            <>
              <div className="d-flex flex-column align-items-center">
                <p className="title">Purchased</p>
                <span className="value purchased-seats">
                  {licenseInfo.purchasedSeats}
                </span>
              </div>
              {isProgramType && (
                <>
                  <div className="separator mx-4" />
                  <div className="d-flex flex-column align-items-center">
                    <p className="title">Consumed</p>
                    <span className="value number-of-consumed">
                      {licenseInfo.consumed}
                    </span>
                  </div>
                </>
              )}
              <div className="separator mx-4" />
              <div className="d-flex flex-column align-items-center">
                <p className="title">Enrolled</p>
                <span className="value">
                  {licenseInfo.numberOfStudents}
                </span>
              </div>
              <div className="separator mx-4" />
              <div className="d-flex flex-column align-items-center">
                <p className="title">Remaining</p>
                <span className="value number-of-remaining">
                  {licenseInfo.purchasedSeats - licenseInfo.numberOfStudents - licenseInfo.numberOfPendingStudents}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="license-page-content-container">
        <div className="flex-end">
          <Button
            as="a"
            href={licenseBuyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none text-white"
          >
            Buy a license
          </Button>
        </div>
        <Table
          isLoading={isLoadingCourses}
          columns={detailColumns}
          data={detailData}
          count={coursesTable.table.count}
          text="No courses found."
        />
        {coursesTable.table.numPages > 1 && (
          <Pagination
            paginationLabel="paginationNavigation"
            pageCount={coursesTable.table.numPages}
            currentPage={currentPage}
            onPageSelect={handlePagination}
            variant="reduced"
            className="mx-auto pagination-table"
            size="small"
          />
        )}
      </div>
    </Container>
  );
};

export default LicensesDetailPage;
