import React, { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Pagination,
  Tabs,
  Tab,
} from '@edx/paragon';
import Table from 'features/Main/Table';
import { fetchClassesData } from 'features/Classes/data/thunks';
import { resetClassesTable, updateCurrentPage } from 'features/Classes/data/slice';
import { fetchInstructorsData } from 'features/Instructors/data/thunks';
import { columns } from 'features/Instructors/InstructorDetailTable/columns';
import { initialPage, RequestStatus } from 'features/constants';

import { useInstitutionIdQueryParam } from 'hooks';

import LinkWithQuery from 'features/Main/LinkWithQuery';

const InstructorsDetailPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { instructorUsername } = useParams();
  const addQueryParam = useInstitutionIdQueryParam();

  const institutionRef = useRef(undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const defaultInstructorInfo = {
    instructorUsername: '',
    instructorName: '',
  };

  const institution = useSelector((state) => state.main.selectedInstitution);
  const classes = useSelector((state) => state.classes.table);
  const instructorInfo = useSelector((state) => state.instructors.table.data)
    .find((instructor) => instructor?.instructorUsername === instructorUsername) || defaultInstructorInfo;
  const isLoading = classes.status === RequestStatus.LOADING;

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  useEffect(() => {
    if (institution.id && instructorUsername) {
      dispatch(fetchClassesData(institution.id, initialPage, '', { instructor: instructorUsername }));
      dispatch(fetchInstructorsData(institution.id, initialPage, { instructor: instructorUsername }));
    }

    return () => {
      dispatch(resetClassesTable());
    };
  }, [dispatch, institution.id, instructorUsername]);

  useEffect(() => {
    dispatch(fetchClassesData(institution.id, currentPage, '', { instructor: instructorUsername }));
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (institution.id !== undefined && institutionRef.current === undefined) {
      institutionRef.current = institution.id;
    }

    if (institution.id !== institutionRef.current) {
      history.push(addQueryParam('/instructors'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institution, history]);

  return (
    <Container size="xl" className="px-4 mt-3">
      <div className="d-flex justify-content-between mb-3 flex-column flex-sm-row">
        <div className="d-flex align-items-center mb-3">
          <LinkWithQuery to="/instructors" className="mr-3 link">
            <i className="fa-solid fa-arrow-left" />
          </LinkWithQuery>
          <h3 className="h2 mb-0 course-title">{instructorInfo.instructorName}</h3>
        </div>
      </div>

      <Tabs variant="tabs" defaultActiveKey="classes" id="uncontrolled-tab-example" className="mb-3 tabstpz">
        <Tab eventKey="classes" title="Classes" />
      </Tabs>

      <Table
        isLoading={isLoading}
        columns={columns}
        count={classes.count}
        data={classes.data}
        text="No classes found."
      />
      {classes.numPages > initialPage && (
      <Pagination
        paginationLabel="paginationNavigation"
        pageCount={classes.numPages}
        currentPage={currentPage}
        onPageSelect={handlePagination}
        variant="reduced"
        className="mx-auto pagination-table"
        size="small"
      />
      )}
    </Container>
  );
};

export default InstructorsDetailPage;
