import React, { useState } from 'react';
import Button from '/imports/ui/components/button/component';
import cx from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { styles } from './styles';

import Auth from '/imports/ui/services/auth';
import Users from '/imports/api/users';
import EmotionModal from './modal';

const EmotionResultsModal = ({
  isModerator,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOnClick = () => {
    setIsModalOpen((status) => !status);
  };

  if (!isModerator) {
    return null;
  }

  return (
    <>
      {
      isModalOpen && (
        <EmotionModal
          dismiss={{
            callback: () => setIsModalOpen((status) => !status),
          }}
        />
      )
    }
      <Button
        label="emotion results"
        className={cx({
          [styles.btn]: true,
        })}
        onClick={handleOnClick}
        hideLabel
        color="primary"
        icon="elipsis"
        size="lg"
        circle
      />
    </>
  );
};

const USER_CONFIG = Meteor.settings.public.user;
const ROLE_MODERATOR = USER_CONFIG.role_moderator;
const amIModerator = () => {
  const currentUser = Users.findOne({ userId: Auth.userID },
    { fields: { role: 1 } });

  if (!currentUser) {
    return false;
  }

  return currentUser.role === ROLE_MODERATOR;
};

const withData = withTracker(() => ({
  isModerator: amIModerator(),
}));

export default withData(EmotionResultsModal);
