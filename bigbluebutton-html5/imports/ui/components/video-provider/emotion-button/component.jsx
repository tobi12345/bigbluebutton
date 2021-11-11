import React, { memo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '/imports/ui/components/button/component';
import { injectIntl } from 'react-intl';
import { debounce } from 'lodash';
import { styles } from './styles';

const JOIN_VIDEO_DELAY_MILLISECONDS = 500;

const propTypes = {
  hasVideoStream: PropTypes.bool.isRequired,
};

const EmotionButton = ({
  hasVideoStream,
}) => {
  const handleOnClick = debounce(() => {
    console.log('hi', { hasVideoStream });
  }, JOIN_VIDEO_DELAY_MILLISECONDS);

  return (
    <Button
      label="emotion button"
      data-test={hasVideoStream ? 'leaveVideo' : 'joinVideo'}
      className={cx(hasVideoStream || styles.btn)}
      onClick={handleOnClick}
      hideLabel
      color={hasVideoStream ? 'primary' : 'default'}
      icon={hasVideoStream ? 'video' : 'video_off'}
      ghost={!hasVideoStream}
      size="lg"
      circle
    />
  );
};

EmotionButton.propTypes = propTypes;

export default injectIntl(memo(EmotionButton));
