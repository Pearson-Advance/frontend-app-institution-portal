import React, { useMemo, useState } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);

  const hasActionColumn = useMemo(
    () => columns.some((col) => col?.cellClassName?.includes('dropdownColumn')),
    [columns],
  );

  const tableClassName = [
    'responsive-data-table',
    hasActionColumn && 'responsive-data-table--sticky',
    isScrolled && 'is-scrolled',
  ].filter(Boolean).join(' ');

  return (
    <div className="table-wrapper-fix">
      <div className={tableClassName} onScroll={(e) => setIsScrolled(e.currentTarget.scrollLeft > 0)}>
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
      </div>
    </div>
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
