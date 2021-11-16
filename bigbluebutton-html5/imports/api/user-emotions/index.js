import { Meteor } from 'meteor/meteor';

const UserEmotions = new Mongo.Collection('users-emotions');

if (Meteor.isServer) {
  // types of queries for the users:
  // 1. meetingId
  // 2. meetingId, userId

  UserEmotions._ensureIndex({ meetingId: 1, userId: 1 });
}

export default UserEmotions;
