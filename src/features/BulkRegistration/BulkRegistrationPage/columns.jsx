import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import { Toast } from '@edx/paragon';

import StatusBadge from 'features/BulkRegistration/BulkRegistrationPage/components/StatusBadge';

const fallbackCopy = (text) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
};

const copyToClipboard = async (text) => {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    fallbackCopy(text);
  }
};

const CopyableCell = ({ value }) => {
  const [show, setShow] = useState(false);

  const isCopyable = !value.includes('Unexpected error');

  const handleCopy = useCallback(async () => {
    if (isCopyable) { return; }

    try {
      await copyToClipboard(value);
      setShow(true);
    } catch (err) {
      setShow(false);
    }
  }, [value, isCopyable]);

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        onClick={handleCopy}
        onKeyDown={(e) => e.key === 'Enter' && handleCopy()}
        style={{ cursor: 'pointer' }}
        title={isCopyable ? value : 'Click to copy error message'}
      >
        {value}
      </span>
      <Toast
        onClose={() => setShow(false)}
        show={show}
        delay={2000}
      >
        Error message copied to clipboard!
      </Toast>
    </>
  );
};

CopyableCell.propTypes = {
  value: PropTypes.string.isRequired,
};

const StatusCell = ({ value }) => <StatusBadge status={value} />;

StatusCell.propTypes = {
  value: PropTypes.string.isRequired,
};

export const ERROR_COLUMNS = [
  { Header: 'ROW', accessor: 'row' },
  { Header: 'EMAIL', accessor: 'email' },
  {
    Header: 'STATUS',
    accessor: 'status',
    Cell: StatusCell,
  },
  {
    Header: 'MESSAGE',
    accessor: 'message',
    Cell: CopyableCell,
  },
];
