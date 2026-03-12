import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';

import {
  LoadingScreen,
  SuccessAll,
  SuccessPartial,
  ErrorRows,
  FatalError,
} from 'features/BulkRegistration/BulkRegistrationPage/components/Results';
import UploadForm from 'features/BulkRegistration/BulkRegistrationPage/components/UploadForm';
import { BULK_REGISTRATION_STATES } from 'features/constants';
import { uploadCSV } from 'features/BulkRegistration/data/api';

import './index.scss';

const mockUploadCSV = (file) => uploadCSV(file);

const BulkRegister = () => {
  const [state, setState] = useState(BULK_REGISTRATION_STATES.IDLE);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const enableBulkRegistration = getConfig()?.PSS_ENABLE_BULK_REGISTRATION || false;
  const selectedInstitution = useSelector((store) => store.main.selectedInstitution);

  const handleUpload = useCallback(async (file) => {
    setState(BULK_REGISTRATION_STATES.LOADING);
    try {
      const res = await mockUploadCSV(file);
      setResult(res);
      setState(res.type);
    } catch (err) {
      setError(err);
      setState(BULK_REGISTRATION_STATES.ERROR_FATAL);
    }
  }, []);

  const handleReset = useCallback(() => {
    setState(BULK_REGISTRATION_STATES.IDLE);
    setResult(null);
    setError(null);
  }, []);

  if (!enableBulkRegistration && selectedInstitution?.hasBulkRegister) {
    // return <Redirect to="/students" />;
  }

  return (
    <div className="bulk-register px-4 container-mw-xl container-fluid">
      <Link className="back-btn" to="/students">
        <i className="fa-solid fa-arrow-left" /> Back to Students
      </Link>

      <header className="bulk-register__header">
        <h1 className="bulk-register__title">Bulk Register</h1>
        <p className="bulk-register__subtitle">Upload a CSV to register multiple students at once</p>
      </header>

      <main className="bulk-register__content">
        {state === BULK_REGISTRATION_STATES.IDLE && <UploadForm onUpload={handleUpload} />}
        {state === BULK_REGISTRATION_STATES.LOADING && <LoadingScreen />}
        {state === BULK_REGISTRATION_STATES.SUCCESS_ALL && <SuccessAll data={result} onReset={handleReset} />}
        {state === BULK_REGISTRATION_STATES.SUCCESS_PARTIAL && <SuccessPartial data={result} onReset={handleReset} />}
        {state === BULK_REGISTRATION_STATES.ERROR_ROWS && <ErrorRows data={result} onReset={handleReset} />}
        {state === BULK_REGISTRATION_STATES.ERROR_FATAL && <FatalError error={error} onReset={handleReset} />}
      </main>
    </div>
  );
};

export default BulkRegister;
