import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Pagination,
  Tabs,
  Tab,
} from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { CalendarExpanded } from 'react-paragon-topaz';
import { startOfMonth, endOfMonth } from 'date-fns';

import Table from 'features/Main/Table';
import { fetchClassesData } from 'features/Classes/data/thunks';
import { resetClassesTable, updateCurrentPage } from 'features/Classes/data/slice';
import { fetchInstructorsData, fetchEventsData, resetEvents } from 'features/Instructors/data';
import { columns } from 'features/Instructors/InstructorDetailTable/columns';
import { initialPage, RequestStatus } from 'features/constants';

import { useInstitutionIdQueryParam } from 'hooks';

import LinkWithQuery from 'features/Main/LinkWithQuery';

import 'features/Instructors/InstructorsDetailPage/index.scss';

const initialState = {
  instructor_id: null,
  start_date: startOfMonth(new Date()).toISOString(),
  end_date: endOfMonth(new Date()).toISOString(),
};

const defaultInstructorInfo = {
  instructorUsername: '',
  instructorName: '',
};

const InstructorsDetailPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { instructorUsername } = useParams();
  const addQueryParam = useInstitutionIdQueryParam();
  const events = useSelector((state) => state.instructors.events.data);

  const institutionRef = useRef(undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [eventsList, setEventsList] = useState([]);
  const [rangeDates, setRangeDates] = useState(initialState);

  const getRangeDate = useCallback((range) => {
    setRangeDates({
      start_date: range.start.toISOString(),
      end_date: range.end.toISOString(),
    });
  }, [setRangeDates]);

  const institution = useSelector((state) => state.main.selectedInstitution);
  const classes = useSelector((state) => state.classes.table);
  const instructorInfo = useSelector((state) => state.instructors.table.data)
    ?.find((instructor) => instructor?.instructorUsername === instructorUsername) || defaultInstructorInfo;

  const isLoading = classes.status === RequestStatus.LOADING;
  const showInstructorCalendar = getConfig()?.enable_instructor_calendar || false;

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  useEffect(() => {
    if (institution.id) {
      dispatch(fetchInstructorsData(institution.id, initialPage, { instructor: instructorUsername }));
    }
  }, [dispatch, institution.id, instructorUsername]);

  useEffect(() => {
    if (institution.id) {
      dispatch(fetchClassesData(institution.id, currentPage, '', { instructor: instructorUsername }));
    }

    return () => {
      dispatch(resetClassesTable());
    };
  }, [dispatch, institution.id, currentPage, instructorUsername]);

  useEffect(() => {
    if (instructorInfo.instructorId && showInstructorCalendar) {
      dispatch(fetchEventsData({ ...rangeDates, instructor_id: instructorInfo.instructorId }));
    }

    return () => {
      dispatch(resetEvents());
    };
  }, [dispatch, instructorInfo.instructorId, rangeDates, showInstructorCalendar]);

  useEffect(() => {
    if (institution.id !== undefined && institutionRef.current === undefined) {
      institutionRef.current = institution.id;
    }

    if (institution.id !== institutionRef.current) {
      history.push(addQueryParam('/instructors'));
    }
  }, [institution, history, addQueryParam]);

  useEffect(() => {
    if (events.length > 0) {
      const list = events?.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));

      setEventsList(list);
    }
  }, [events]);

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
        <Tab eventKey="classes" title="Classes" tabClassName="text-decoration-none">
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
        </Tab>
        {
        showInstructorCalendar && (
          <Tab eventKey="availability" title="Availability" tabClassName="text-decoration-none">
            <div className="p-3 bg-white mb-5 rounded-bottom container-calendar">
              <CalendarExpanded
                eventsList={eventsList}
                onRangeChange={getRangeDate}
                hideDeleteButtons
                hideEditButtons
              />
            </div>
          </Tab>
        )
        }
      </Tabs>
    </Container>
  );
};

export default InstructorsDetailPage;
