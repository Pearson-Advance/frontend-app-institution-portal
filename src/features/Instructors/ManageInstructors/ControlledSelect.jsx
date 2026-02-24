import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { CheckboxControl } from '@openedx/paragon';
import { addRowSelect, deleteRowSelect } from 'features/Instructors/data/slice';

const useConvertIndeterminateProp = (props) => {
  const updatedProps = useMemo(
    () => {
      const { indeterminate, ...rest } = props;
      return { isIndeterminate: indeterminate, ...rest };
    },
    [props],
  );
  return updatedProps;
};

const ControlledSelect = ({ row }) => {
  const dispatch = useDispatch();

  const toggleSelected = useCallback(
    () => {
      if (row.isSelected) {
        dispatch(deleteRowSelect(row.id));
        row.toggleRowSelected();
      } else {
        dispatch(addRowSelect(row.id));
        row.toggleRowSelected();
      }
    },
    [row, dispatch],
  );

  const updatedProps = useConvertIndeterminateProp(row.getToggleRowSelectedProps());

  return (
    <div className="test-checkbox">
      <CheckboxControl
        {...updatedProps}
        onChange={toggleSelected}
      />
    </div>
  );
};

ControlledSelect.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    getToggleRowSelectedProps: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
    toggleRowSelected: PropTypes.func.isRequired,
  }).isRequired,
};

export default ControlledSelect;
