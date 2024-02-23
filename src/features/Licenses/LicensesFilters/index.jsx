import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Col, Form } from '@edx/paragon';
import { Select, Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';

import { initialPage } from 'features/constants';
import { fetchCoursesData } from 'features/Courses/data/thunks';
import { updateFilters, updateCurrentPage } from 'features/Licenses/data/slice';

import { fetchLicensesData } from 'features/Licenses/data';

const LicensesFilters = ({ resetPagination }) => {
  const dispatch = useDispatch();
  const institution = useSelector((state) => state.main.selectedInstitution);
  const courses = useSelector((state) => state.courses.table.data);
  const licenses = useSelector((state) => state.licenses.table.data);

  const [courseOptions, setCourseOptions] = useState([]);
  const [licenseOptions, setLicenseOptions] = useState([]);
  const [courseSelected, setCourseSelected] = useState(null);
  const [licenseSelected, setLicenseSelected] = useState(null);

  const isButtonDisabled = courseSelected === null && licenseSelected === null;

  const handleSelectFilters = async (e) => {
    e.preventDefault();

    if (isButtonDisabled) {
      return;
    }

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const urlParamsFilters = Object.entries(formJson)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    try {
      dispatch(updateFilters(formJson));
      dispatch(updateCurrentPage(initialPage));
      dispatch(fetchLicensesData(institution.id, initialPage, urlParamsFilters));
    } catch (error) {
      logError(error);
    }
  };

  const handleCleanFilters = () => {
    dispatch(fetchLicensesData(institution.id, initialPage));
    resetPagination();
    setLicenseSelected(null);
    setCourseSelected(null);
    dispatch(updateFilters({}));
  };

  useEffect(() => {
    const parseCoursesToOptions = courses.length > 0
      ? courses.map(course => ({
        ...course,
        label: course.masterCourseName,
        value: course.masterCourseName,
      })) : [];

    const parseLicensesToOptions = licenses.length > 0
      ? licenses.map(license => ({
        ...license,
        label: license.licenseName,
        value: license.licenseName,
      }))
      : [];

    setCourseOptions(parseCoursesToOptions);
    setLicenseOptions(parseLicensesToOptions);
  }, [licenses, courses]);

  useEffect(() => {
    setLicenseSelected(null);
    setCourseSelected(null);
    dispatch(fetchCoursesData(institution.id, initialPage));
  }, [institution, dispatch]);

  return (
    <Form onSubmit={handleSelectFilters} className="w-100 px-4 d-flex flex-column align-items-center">
      <Form.Row className="px-0 d-flex flex-wrap w-100">
        <Form.Group as={Col} className="px-0 w-50">
          <Select
            placeholder="License name"
            name="license_name"
            className="mr-2 select"
            options={licenseOptions}
            onChange={option => setLicenseSelected(option)}
            value={licenseSelected}
          />
        </Form.Group>
        <Form.Group as={Col} className="px-0 w-50">
          <Select
            placeholder="Course"
            name="course_name"
            options={courseOptions}
            onChange={option => setCourseSelected(option)}
            value={courseSelected}
          />
        </Form.Group>
      </Form.Row>
      <Form.Group className="w-100 d-flex justify-content-end px-0">
        <Button onClick={handleCleanFilters} variant="tertiary" text className="mr-2" disabled={isButtonDisabled}>Reset</Button>
        <Button type="submit" disabled={isButtonDisabled}>Apply</Button>
      </Form.Group>
    </Form>
  );
};

LicensesFilters.propTypes = {
  resetPagination: PropTypes.func.isRequired,
};

export default LicensesFilters;
