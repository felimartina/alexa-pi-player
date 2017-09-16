const awsIot = require('aws-iot-device-sdk')
const DEVICE_ID = 'pipe-pi-player'
const device = awsIot.device({
  keyPath: './aws-certs/pi-player.private.key',
  certPath: './aws-certs/pi-player.cert.pem',
  caPath: './aws-certs/root-CA.crt',
  clientId: DEVICE_ID,
  host: 'a2gz7mqshgy1hg.iot.us-east-1.amazonaws.com'
})

device.on('connect', () => {
  console.log('Connected to AWS IoT...ready to start playing')
  device.subscribe(`pi-players/${DEVICE_ID}`)
  // device.publish('topic_2', JSON.stringify({ test_data: 1}));
})

device.on('message', (topic, payload) => {
  console.log('message', topic, payload.toString())
})
