import { Meteor } from 'meteor/meteor';
import setUserEmotions from './methods/setUserEmotions';
import startUserEmotions from './methods/startUserEmotions';
import endUserEmotions from './methods/endUserEmotions';
import modelLoadTime from './methods/modelLoadTime';
// import analyzeUserEmotions from './methods/analyzeUserEmotions';

Meteor.methods({
  setUserEmotions,
  startUserEmotions,
  endUserEmotions,
  modelLoadTime
  // analyzeUserEmotions,
});
