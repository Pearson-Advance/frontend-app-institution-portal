import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'react-paragon-topaz';
import { Container, Pagination } from '@edx/paragon';
import Table from 'features/Main/Table';
import { columns } from 'features/Licenses/LicenseDetailTable/columns';
import { fetchCoursesData } from 'features/Courses/data/thunks';
import { resetCoursesTable, updateCurrentPage } from 'features/Courses/data/slice';
import { fetchLicensesData } from 'features/Licenses/data';

import { initialPage, licenseBuyLink } from 'features/constants';
import 'features/Licenses/LicensesDetailPage/index.scss';

const LicensesDetailPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { licenseId } = useParams();

  const institutionRef = useRef(undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const defaultLicenseInfo = {
    licenseName: '-',
    purchasedSeats: '-',
    numberOfStudents: '-',
    numberOfPendingStudents: '-',
  };

  const institution = useSelector((state) => state.main.selectedInstitution);
  const coursesTable = useSelector((state) => state.courses.table);
  const licenseInfo = useSelector((state) => state.licenses.table.data)
    .find((license) => license?.licenseId === parseInt(licenseId, 10)) || defaultLicenseInfo;

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  useEffect(() => {
    if (institution.id) {
      dispatch(fetchCoursesData(institution.id, initialPage, { license_id: licenseId }));
      dispatch(fetchLicensesData(institution.id, initialPage, licenseId));
    }

    return () => {
      dispatch(resetCoursesTable());
    };
  }, [dispatch, institution.id, licenseId]);

  useEffect(() => {
    if (institution.id !== undefined && institutionRef.current === undefined) {
      institutionRef.current = institution.id;
    }

    if (institution.id !== institutionRef.current) {
      history.push('/licenses');
    }
  }, [institution, history]);

  return (
    <Container size="xl" className="px-4">
      <div className="d-flex justify-content-between mb-3 flex-column flex-sm-row">
        <div className="d-flex align-items-start mb-3">
          <Link to="/licenses" className="mr-3 mt-2 link">
            <i className="fa-solid fa-arrow-left" />
          </Link>
          <div>
            <h3 className="h2 mb-0 course-title">License pool: {licenseInfo.licenseName}</h3>
            <p>
              Courses for which a license can be used/assigned from this pool.
            </p>
          </div>
        </div>
        <div className="card-container d-flex justify-content-around align-items-center">
          <div className="d-flex flex-column align-items-center">
            <p className="title">Purchased</p>
            <span className="value purchased-seats">
              {licenseInfo.purchasedSeats}
            </span>
          </div>
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
            <span className="value number-of-pending">
              {licenseInfo.numberOfPendingStudents}
            </span>
          </div>
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
        <Table columns={columns} data={coursesTable.data} count={coursesTable.count} text="No courses found." />
        {coursesTable.numPages > 1 && (
        <Pagination
          paginationLabel="paginationNavigation"
          pageCount={coursesTable.numPages}
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
