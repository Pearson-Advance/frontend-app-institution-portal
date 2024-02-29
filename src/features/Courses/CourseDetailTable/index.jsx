import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import DataTable from '@edx/paragon/dist/DataTable';

import { columns } from 'features/Courses/CourseDetailTable/columns';

const CourseDetailTable = ({ data, count }) => {
  const COLUMNS = useMemo(() => columns, []);

  return (
    <IntlProvider locale="en">
      <DataTable
        isSortable
        columns={COLUMNS}
        itemCount={count}
        data={data}
      >
        <DataTable.Table />
        <DataTable.EmptyTable content="No classes were found." />
        <DataTable.TableFooter />
      </DataTable>
    </IntlProvider>
  );
};

CourseDetailTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
};

CourseDetailTable.defaultProps = {
  data: [],
  count: 0,
};

export default CourseDetailTable;
