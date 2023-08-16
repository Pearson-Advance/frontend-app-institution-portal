import React, { useMemo } from 'react';
import Container from '@edx/paragon/dist/Container';
import { getColumns } from 'features/Students/components/StudentsTable/columns';
import { StudentsTable } from 'features/Students/components/StudentsTable/index';
import {
  Pagination,
  useToggle,
  AlertModal,
  ActionRow,
  Button,
} from '@edx/paragon';

const StudentsPage = () => {

  const data = useMemo(() => [
  {
    name: 'Lil Bub',
    email: 'brown tabby',
    courseTitle: 'weird tongue',
    instructors: 'whatever',
    created: '22323'
  },
  {
    name: 'Lil Bub',
    email: 'brown tabby',
    courseTitle: 'weird tongue',
    instructors: 'whatever',
    created: '22323',
  },
  {
    name: 'Lil Bub',
    email: 'brown tabby',
    courseTitle: 'weird tongue',
    instructors: 'whatever',
    created: '22323'
  },
], [])

  const [isOpen, open, close] = useToggle(false);
  const COLUMNS = useMemo(() => getColumns(), [open]);

  return (
    <Container>
      <StudentsTable
        data={data}
        count={3}
        columns={COLUMNS}
      />
    </Container>
  );
};

export { StudentsPage };
