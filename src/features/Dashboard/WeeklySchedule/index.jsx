import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { DateRange } from 'react-date-range';
import {
  startOfWeek,
  endOfWeek,
  format,
} from 'date-fns';

import { fetchClassesData } from 'features/Dashboard/data';

import 'features/Dashboard/WeeklySchedule/index.scss';

const WeeklySchedule = () => {
  const dispatch = useDispatch();
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const classesData = useSelector((state) => state.dashboard.classes.data);
  const [classList, setClassList] = useState([]);
  const startWeek = startOfWeek(new Date());
  const endWeek = endOfWeek(new Date());
  const [stateDate, setStateDate] = useState([
    {
      startDate: startWeek,
      endDate: endWeek,
      key: 'selection',
    },
  ]);
  const numberOfClasses = 3;

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0) {
      dispatch(fetchClassesData(selectedInstitution?.id, true));
    }
  }, [selectedInstitution, dispatch]);

  useEffect(() => {
    // Display only the first 'NumberOfClasses' on the homepage.
    if (classesData.length > numberOfClasses) {
      setClassList(classesData.slice(0, numberOfClasses));
    } else {
      setClassList(classesData);
    }
  }, [classesData]);

  return (
    <>
      <div className="header-schedule">
        <h3>Class schedule</h3>
      </div>
      <div className="content-schedule d-flex justify-content-between">
        <div className="container-class-schedule">
          {classList.map(classInfo => {
            const date = format(new Date(classInfo?.startDate), 'PP');
            return (
              <div className="class-schedule" key={classInfo?.classId}>
                <div className="class-text">
                  <p className="class-name">{classInfo?.className}</p>
                  <p className="class-descr">
                    <i className="fa-sharp fa-regular fa-calendar-day" />{date}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <DateRange
          showDateDisplay={false}
          onChange={item => setStateDate([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={stateDate}
          rangeColors={['#e4faff']}
        />
      </div>
    </>
  );
};

export default WeeklySchedule;
