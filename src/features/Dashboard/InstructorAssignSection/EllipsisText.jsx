import PropTypes from 'prop-types';
import { Tooltip, OverlayTrigger } from '@edx/paragon';

import { textLength } from 'features/constants';

const EllipsisText = ({ title, type }) => (
  <OverlayTrigger
    placement={type === 'className' ? 'top' : 'bottom'}
    overlay={
    (
      <Tooltip>
        {title}
      </Tooltip>
    )
    }
    trigger={['hover', 'focus']}
    show={undefined}
  >
    {type === 'className' ? (
      <h4>{title.substring(0, textLength)}...</h4>
    ) : (
      <p className="course-name">{title.substring(0, textLength)}...</p>
    )}
  </OverlayTrigger>
);

EllipsisText.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default EllipsisText;
