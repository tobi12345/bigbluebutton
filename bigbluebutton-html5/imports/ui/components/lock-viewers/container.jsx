import React, { useContext } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withModalMounter } from '/imports/ui/components/modal/service';
import Meetings from '/imports/ui/local-collections/meetings-collection/meetings';
import Auth from '/imports/ui/services/auth';
import LockViewersComponent from './component';
import { updateLockSettings, updateWebcamsOnlyForModerator } from './service';
import { UsersContext } from '../components-data/users-context/context';

const ROLE_MODERATOR = Meteor.settings.public.user.role_moderator;

const LockViewersContainer = (props) => {
  const usingUsersContext = useContext(UsersContext);
  const { users } = usingUsersContext;
  const currentUser = users[Auth.meetingID][Auth.userID];
  const amIModerator = currentUser.role === ROLE_MODERATOR;

  return amIModerator && <LockViewersComponent {...props} />
}

export default withModalMounter(withTracker(({ mountModal }) => ({
  closeModal: () => mountModal(null),
  meeting: Meetings.findOne({ meetingId: Auth.meetingID }),
  updateLockSettings,
  updateWebcamsOnlyForModerator,
  showToggleLabel: false,
}))(LockViewersContainer));
