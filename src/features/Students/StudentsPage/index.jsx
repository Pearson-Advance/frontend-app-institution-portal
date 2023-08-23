import React, { useEffect, useMemo  } from 'react';
import { useStudentEnrollments } from 'features/Students/data/slices';
import { fetchStudentEnrollments } from 'features/Students/data/thunks';

import Container from '@edx/paragon/dist/Container';
import { getColumns } from 'features/Students/StudentsTable/columns';
import { StudentsTable } from 'features/Students/StudentsTable/index';

import {
  Pagination,
  useToggle,
  AlertModal,
  ActionRow,
  Button,
} from '@edx/paragon';

const StudentsPage = () => {
  const { state, dispatch } = useStudentEnrollments();

  useEffect(() => {
    fetchStudentEnrollments(dispatch);
  }, [dispatch]);

  const data = state.data.results

  console.log(data)

    const COLUMNS = useMemo(() => getColumns(), [open]);
  
    return (
      <Container>
        <StudentsTable
          data={data}
          count={state.data.count}
          columns={COLUMNS}
        />
      </Container>
    );
};

export default StudentsPage;
