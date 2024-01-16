import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Container } from '@edx/paragon';
import StudentsMetrics from 'features/Students/StudentsMetrics';
import LicensesTable from 'features/Licenses/LicensesTable';
import { Button } from 'react-paragon-topaz';

import { fetchLicensesData } from 'features/Dashboard/data';
import { updateActiveTab } from 'features/Main/data/slice';

import 'features/Dashboard/DashboardPage/index.scss';

const DashboardPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const stateInstitution = useSelector((state) => state.main.institution.data);
  const licenseData = useSelector((state) => state.dashboard.tableLicense.data);
  const [dataTableLicense, setDataTableLicense] = useState([]);

  let idInstitution = '';
  // eslint-disable-next-line no-unused-expressions
  stateInstitution.length > 0 ? idInstitution = stateInstitution[0].id : idInstitution = '';

  const handleViewAllLicenses = () => {
    history.push('/licenses');
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
    dispatch(fetchLicensesData(idInstitution));
  }, [idInstitution]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container size="xl" className="px-4">
      <h2 className="title-page">
        {stateInstitution.length === 1 ? `Welcome to ${stateInstitution[0].name}` : 'Select an institution'}
      </h2>
      <StudentsMetrics />
      <div className="license-section">
        <div className="d-flex justify-content-between px-4">
          <h3>License inventory</h3>
          <Button onClick={handleViewAllLicenses} variant="outline-primary">View All</Button>
        </div>
        <LicensesTable data={dataTableLicense} />
      </div>
    </Container>
  );
};

export default DashboardPage;
