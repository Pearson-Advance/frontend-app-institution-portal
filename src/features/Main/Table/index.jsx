import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from '@openedx/paragon';

const Table = ({
  columns,
  data,
  count,
  text,
  ...props
}) => {
  const COLUMNS = useMemo(() => columns, [columns]);

  return (
    <DataTable
      isSortable
      columns={COLUMNS}
      itemCount={count}
      data={data}
      {...props}
    >
      <DataTable.Table />
      <DataTable.EmptyTable content={text} />
      <DataTable.TableFooter />
    </DataTable>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape([])).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
  text: PropTypes.string.isRequired,
};

Table.defaultProps = {
  data: [],
  count: 0,
};

export default Table;
