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
import { startOfMonth, endOfMonth, endOfDay } from 'date-fns';
import { logError } from '@edx/frontend-platform/logging';
import { CalendarExpanded, Button, AddEventModal } from 'react-paragon-topaz';

import Table from 'features/Main/Table';
import { fetchClassesData } from 'features/Classes/data/thunks';
import { resetClassesTable, updateCurrentPage } from 'features/Classes/data/slice';
import {
  fetchInstructorsData,
  fetchEventsData,
  resetEvents,
  updateEvents,
} from 'features/Instructors/data';
import { createInstructorEvent } from 'features/Instructors/data/api';
import { columns } from 'features/Instructors/InstructorDetailTable/columns';
import { initialPage, RequestStatus, AVAILABILITY_VALUES } from 'features/constants';

import { useInstitutionIdQueryParam } from 'hooks';
import { setTimeInUTC, stringToDateType } from 'helpers';

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

const generateValueLabelPairs = (options) => options.reduce((accumulator, option) => {
  accumulator[option.value] = option.label;
  return accumulator;
}, {});

const typeEventOptions = [
  { label: 'Not available', value: AVAILABILITY_VALUES.notAvailable },
  { label: 'Available', value: AVAILABILITY_VALUES.available },
  { label: 'Prep Time', value: AVAILABILITY_VALUES.prepTime },
];

const eventTitles = generateValueLabelPairs(typeEventOptions);

const InstructorsDetailPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { instructorUsername } = useParams();

  const addQueryParam = useInstitutionIdQueryParam();
  const events = useSelector((state) => state.instructors.events.data);

  const institutionRef = useRef(undefined);
  const [eventsList, setEventsList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [rangeDates, setRangeDates] = useState(initialState);

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

  const handleToggleModal = () => setIsModalOpen(!isModalOpen);

  const getRangeDate = useCallback((range) => {
    setRangeDates({
      start_date: range.start.toISOString(),
      end_date: range.end.toISOString(),
    });
  }, [setRangeDates]);

  const createNewEvent = async (eventData) => {
    try {
      const endTypeDate = stringToDateType(eventData.endDate);
      const eventDataRequest = {
        instructor_id: instructorInfo.instructorId,
        title: eventTitles[eventData.availability || 'available'],
        availability: eventData.availability || 'available',
        start: setTimeInUTC(stringToDateType(eventData.startDate), eventData.startHour),
        end: setTimeInUTC(endOfDay(endTypeDate), eventData.endHour),
        recurrence: eventData.recurrence.value,
      };

      const { data: newEvent } = await createInstructorEvent(eventDataRequest);
      dispatch(updateEvents([...events, newEvent]));

      if (eventDataRequest.recurrence) {
        dispatch(fetchEventsData(rangeDates, events));
      }
    } catch (error) {
      logError(error);
    }
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
            <AddEventModal
              isOpen={isModalOpen}
              onClose={handleToggleModal}
              onSave={createNewEvent}
            />
            <div className="d-flex justify-content-between align-items-baseline bg-primary px-3 py-2 rounded-top">
              <h4 className="text-white">Availability</h4>
              <Button variant="inverse-primary" onClick={handleToggleModal}>
                <i className="fa-light fa-plus pr-2" />
                New event
              </Button>
            </div>
            <div className="p-3 bg-white mb-5 rounded-bottom container-calendar">
              <CalendarExpanded
                eventsList={eventsList}
                onRangeChange={getRangeDate}
                onEdit={() => {}}
                onDelete={() => {}}
                onDeleteMultiple={() => {}}
                onEditSinglRec={() => {}}
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
