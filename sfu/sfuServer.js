const mediasoup = require('mediasoup');
const config = require('../config/mediasoupConfig');

let worker;

const createMediasoupWorker = async () => {
  worker = await mediasoup.createWorker({
    rtcMinPort: config.worker.rtcMinPort,
    rtcMaxPort: config.worker.rtcMaxPort,
    logLevel: config.worker.logLevel,
    logTags: config.worker.logTags
  });

  console.log('Mediasoup worker created');

  worker.on('died', () => {
    console.error('Mediasoup worker has died');
    process.exit(1);
  });

  return worker;
};

module.exports = { createMediasoupWorker };
