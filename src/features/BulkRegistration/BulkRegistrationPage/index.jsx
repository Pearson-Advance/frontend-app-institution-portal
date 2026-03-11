import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

import {
  LoadingScreen,
  SuccessAll,
  SuccessPartial,
  ErrorRows,
  FatalError,
} from 'features/BulkRegistration/BulkRegistrationPage/components/Results';
import UploadForm from 'features/BulkRegistration/BulkRegistrationPage/components/UploadForm';
import { BULK_REGISTRATION_STATES } from 'features/constants';

import './index.scss';

// ─── Mock API call ────────────────────────────────────────────────────────────
const mockUploadCSV = async (file) => {
  await new Promise((resolve) => { setTimeout(resolve, 1000); });

  const name = file.name.toLowerCase();

  if (name.includes('fatal') || name.includes('500')) {
    throw Object.assign(new Error('Internal server error. Please contact support.'), { status: 500, detail: 'Internal server error. Please contact support.' });
  }

  if (name.includes('error') || name.includes('fail')) {
    return {
      type: BULK_REGISTRATION_STATES.ERROR_ROWS,
      failedRows: [
        {
          row: 2, firstName: 'John', lastName: 'Smith', email: '-', status: 'Validation failed', message: 'Invalid or missing email address',
        },
        {
          row: 5, firstName: 'Sarah', lastName: 'Williams', email: 'sarah.williams@example.com', status: 'Processing failed', message: 'Database connection timeout during account creation',
        },
        {
          row: 7, firstName: '-', lastName: '-', email: 'incomplete@example.com', status: 'Validation failed', message: 'First name and last name are required',
        },
      ],
    };
  }

  if (name.includes('partial') || name.includes('mixed')) {
    return {
      type: BULK_REGISTRATION_STATES.SUCCESS_PARTIAL,
      totalRows: 8,
      alreadyExisted: 2,
      createdSuccessfully: 6,
    };
  }

  return {
    type: BULK_REGISTRATION_STATES.SUCCESS_ALL,
    totalRegistered: 8,
  };
};

const BulkRegister = () => {
  const [state, setState] = useState(BULK_REGISTRATION_STATES.IDLE);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
