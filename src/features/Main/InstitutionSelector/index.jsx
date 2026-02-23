import React, {
  useEffect,
  useState,
} from 'react';

import { Row, Col } from '@edx/paragon';
import { Select } from 'react-paragon-topaz';

import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { formatSelectOptions } from 'helpers';
import { INSTITUTION_QUERY_ID } from 'features/constants';

import { updateSelectedInstitution } from 'features/Main/data/slice';

const selectorStyles = {
  control: base => ({
    ...base,
    padding: '3px',
  }),
};

const InstitutionSelector = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const institutions = useSelector((state) => state.main.institution.data);
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);

  const [institutionOptions, setInstitutionOptions] = useState([]);

  const searchParams = new URLSearchParams(location.search);

  const updateQueryParam = (value) => {
    const { id = '' } = value;
    searchParams.set(INSTITUTION_QUERY_ID, id);
    navigate({ search: searchParams.toString() });

    dispatch(updateSelectedInstitution(value));
  };

  useEffect(() => {
    if (institutions.length > 0) {
      const institutionId = searchParams.get(INSTITUTION_QUERY_ID);

      const options = formatSelectOptions(institutions);
      setInstitutionOptions(options);

      if (institutionId) {
        const institutionByQuery = options.filter((option) => option.id === parseInt(institutionId, 10));

        if (institutionByQuery[0]) {
          dispatch(updateSelectedInstitution(institutionByQuery[0]));
        } else {
          dispatch(updateSelectedInstitution(options[0]));
        }
      } else {
        updateQueryParam(options[0]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutions, dispatch]);

  return (
    <Row className="selector-institution">
      <Col md={5}>
        <h4>Select an institution</h4>
        <Select
          styles={selectorStyles}
          placeholder="Institution"
          name="institution"
          options={institutionOptions}
          defaultValue={institutionOptions[0] || []}
          onChange={updateQueryParam}
          value={selectedInstitution}
        />
      </Col>
    </Row>
  );
};

export default InstitutionSelector;
