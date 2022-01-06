// import { extractCredentials } from '/imports/api/common/server/helpers';
import * as faceapi from 'face-api.js';
import fetch from 'node-fetch';

const canvas = require('canvas');

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({
  fetch, Canvas, Image, ImageData,
});

const modelPromise = [
  faceapi.nets.tinyFaceDetector.loadFromUri('https://bbb.kleselcodes.de/html5client/models/tiny_face_detector_model-weights_manifest.json'),
  faceapi.nets.faceExpressionNet.loadFromUri('https://bbb.kleselcodes.de/html5client/models'),
];
// function bufferToImage(buf) {
//   return new Promise(function (resolve, reject) {
//       var reader = new FileReader();
//       reader.onload = function () {
//           if (typeof reader.result !== 'string') {
//               return reject('bufferToImage - expected reader.result to be a string, in onload');
//           }
//           var img = Image();
//           img.onload = function () { return resolve(img); };
//           img.onerror = reject;
//           img.src = reader.result;
//       };
//       reader.onerror = reject;
//       reader.readAsDataURL(buf);
//   });
// }

export default async function analyzeUserEmotions(blob) {
  // const { meetingId, requesterUserId: userId } = extractCredentials(this.userId);

  console.log('yolo', blob.length);
  await Promise.all(modelPromise);
  const img = new Image();
  img.src = blob;
  await faceapi
    .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions()
    .then((detections) => {
      console.log(detections);
    })
    .catch((error) => console.log(error));
}
