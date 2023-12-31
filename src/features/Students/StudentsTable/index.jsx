import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import DataTable from '@edx/paragon/dist/DataTable';
import {
  Row,
  Col,
  ActionRow,
  Button,
  AlertModal,
  useToggle,
} from '@edx/paragon';
import { IntlProvider } from 'react-intl';
import { handleEnrollments } from 'features/Students/data/api';
import { getColumns, hideColumns } from 'features/Students/StudentsTable/columns';
import { fetchStudentsData } from 'features/Students/data/thunks';

const StudentsTable = ({
  data,
  count,
}) => {
  const dispatch = useDispatch();
  const [isOpenAlertModal, openAlertModal, closeAlertModal] = useToggle(false);
  const [selectedRow, setRow] = useState({});
  const COLUMNS = useMemo(() => getColumns({ openAlertModal, setRow }), [openAlertModal]);
  const enrollmentData = new FormData();
  enrollmentData.append('identifiers', selectedRow.learnerEmail);
  enrollmentData.append('action', 'unenroll');

  const handleStudentsActions = async () => {
    await handleEnrollments(enrollmentData, selectedRow.ccxId);
    dispatch(fetchStudentsData());
    closeAlertModal();
  };

  return (
    <IntlProvider locale="en">
      <Row className="justify-content-center my-4 my-3">
        <Col xs={11} className="p-0">
          <DataTable
            isSortable
            itemCount={count}
            data={data}
            columns={COLUMNS}
            initialState={hideColumns}
          >
            <DataTable.Table />
            <DataTable.EmptyTable content="No students found." />
            <DataTable.TableFooter />
          </DataTable>
        </Col>
      </Row>
      <AlertModal
        title={"Are you sure you want to Revoke the student's enrollment?"}
        isOpen={isOpenAlertModal}
        onClose={closeAlertModal}
        footerNode={(
          <ActionRow>
            <Button variant="link" onClick={closeAlertModal}>Cancel</Button>
            <Button variant="light" onClick={handleStudentsActions}>
              Submit
            </Button>
          </ActionRow>
        )}
      >
        <p>
          Learner with email <b>{selectedRow.learnerEmail}</b> will be revoked from <b>{selectedRow.ccxName}</b>
        </p>
      </AlertModal>
    </IntlProvider>
  );
};

StudentsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
};

StudentsTable.defaultProps = {
  data: [],
  count: 0,
};

export { StudentsTable };
