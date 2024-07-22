import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';

import { Container, Col, Row } from '@edx/paragon';
import StudentsMetrics from 'features/Students/StudentsMetrics';
import LicensesTable from 'features/Licenses/LicensesTable';
import { Button } from 'react-paragon-topaz';
import InstructorAssignSection from 'features/Dashboard/InstructorAssignSection';
import WeeklySchedule from 'features/Dashboard/WeeklySchedule';

import { fetchLicensesData } from 'features/Dashboard/data';
import { updateActiveTab } from 'features/Main/data/slice';

import { useInstitutionIdQueryParam } from 'hooks';

import 'features/Dashboard/DashboardPage/index.scss';

const DashboardPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const stateInstitution = useSelector((state) => state.main.institution.data);
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const licenseData = useSelector((state) => state.dashboard.tableLicense.data);
  const [dataTableLicense, setDataTableLicense] = useState([]);
  const imageDashboard = getConfig().IMAGE_DASHBOARD_URL;

  const addQueryParam = useInstitutionIdQueryParam();

  const handleViewAllLicenses = () => {
    history.push(addQueryParam('/licenses'));
    dispatch(updateActiveTab('licenses'));
  };

  useEffect(() => {
    if (licenseData.length > 5) {
      // Return 5 licenses with fewest remaining seats
      const arraySorted = licenseData.slice().sort((license1, license2) => {
        if (license1.numberOfPendingStudents > license2.numberOfPendingStudents) { return 1; }
        if (license1.numberOfPendingStudents < license2.numberOfPendingStudents) { return -1; }
        return 0;
      });
      setDataTableLicense(arraySorted.slice(0, 5));
    } else { setDataTableLicense(licenseData); }
  }, [licenseData]);

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0) {
      dispatch(fetchLicensesData(selectedInstitution?.id));
    }
  }, [selectedInstitution, dispatch]);

  return (
    <Container size="xl" className="px-4 pt-3">
      <h2 className="title-page mt-3 mb-3">
        {Object.keys(selectedInstitution).length > 0 ? `Welcome to ${selectedInstitution?.name}` : `Welcome to ${stateInstitution[0]?.name}`}
      </h2>
      <StudentsMetrics />
      <Row className="schedule-section">
        <Col lg="9" xs="12">
          <WeeklySchedule />
        </Col>
        {imageDashboard && (
          <Col lg="3" xs="12">
            <div className="image-dashboard">
              <img src={imageDashboard} alt="" />
            </div>
          </Col>
        )}
      </Row>
      <Row>
        <Col lg="9" xs="12">
          <div className="license-section">
            <div className="d-flex justify-content-between px-4">
              <h3>License inventory</h3>
              <Button onClick={handleViewAllLicenses} variant="outline-primary">View All</Button>
            </div>
            <LicensesTable data={dataTableLicense} />
          </div>
        </Col>
        <Col lg="3" xs="12">
          <div className="instructor-assign-section">
            <InstructorAssignSection />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
