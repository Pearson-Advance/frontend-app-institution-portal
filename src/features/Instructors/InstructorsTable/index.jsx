import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { IntlProvider } from 'react-intl';
import {
  Row,
  Col,
} from '@edx/paragon';
import DataTable from '@edx/paragon/dist/DataTable';

import { hideColumns, columns } from 'features/Instructors/InstructorsTable/columns';

const InstructorsTable = ({
  data,
  count,
}) => {
  const COLUMNS = useMemo(() => columns, []);

  return (
    <IntlProvider locale="en">
      <Row lassName="justify-content-center my-4 border-gray-300 bg-light-100 my-3">
        <Col xs={11}>
          <DataTable
            isSortable
            columns={COLUMNS}
            itemCount={count}
            data={data}
            initialState={hideColumns}
          >
            <DataTable.Table />
            <DataTable.EmptyTable content="No instructors found." />
            <DataTable.TableFooter />
          </DataTable>
        </Col>
      </Row>
    </IntlProvider>
  );
};

InstructorsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
};

InstructorsTable.defaultProps = {
  data: [],
  count: 0,
};

export default InstructorsTable;
