import React from 'react';
import DataTable from '@edx/paragon/dist/DataTable';
import { Row, Col } from '@edx/paragon';

const StudentsTable = ({ data, columns, count }) => {
    return(
        <Row className="justify-content-center my-4 border-gray-300 bg-light-100 my-3">
            <Col xs={11}>
            <DataTable
                isSortable
                itemCount={count}
                data={data}
                columns={columns}
            >
                <DataTable.Table />
                <DataTable.EmptyTable content="No enrollments found." />
                <DataTable.TableFooter />
            </DataTable>
            </Col>
        </Row>
    );
};

export { StudentsTable };
