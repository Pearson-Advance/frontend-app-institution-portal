import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
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
import { initialPage } from 'features/constants';

const InstructorsDetailPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { instructorUsername } = useParams();

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

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  useEffect(() => {
    if (institution.id) {
      dispatch(fetchClassesData(institution.id, initialPage, '', { instructor: instructorInfo.instructorUsername }));
      dispatch(fetchInstructorsData(institution.id, initialPage, instructorInfo.instructorUsername));
    }

    return () => {
      dispatch(resetClassesTable());
    };
  }, [dispatch, institution.id, instructorInfo.instructorUsername]);

  useEffect(() => {
    dispatch(fetchClassesData(institution.id, currentPage, '', { instructor: instructorInfo.instructorUsername }));
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (institution.id !== undefined && institutionRef.current === undefined) {
      institutionRef.current = institution.id;
    }

    if (institution.id !== institutionRef.current) {
      history.push('/instructors');
    }
  }, [institution, history]);

  return (
    <Container size="xl" className="px-4 mt-3">
      <div className="d-flex justify-content-between mb-3 flex-column flex-sm-row">
        <div className="d-flex align-items-center mb-3">
          <Link to="/instructors" className="mr-3 link">
            <i className="fa-solid fa-arrow-left" />
          </Link>
          <h3 className="h2 mb-0 course-title">{instructorInfo.instructorName}</h3>
        </div>
      </div>

      <Tabs variant="tabs" defaultActiveKey="classes" id="uncontrolled-tab-example" className="mb-3 tabstpz">
        <Tab eventKey="classes" title="Classes" />
      </Tabs>

      <Table columns={columns} count={classes.count} data={classes.data} text="No classes found." />
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
