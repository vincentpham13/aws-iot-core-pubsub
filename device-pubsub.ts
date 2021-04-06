import { device } from 'aws-iot-device-sdk';

async function main() {
  const vincentDevice = new device({
    keyPath: 'certs/c1c5ef35d2-private.pem.key',
    certPath: 'certs/c1c5ef35d2-certificate.pem.crt',
    caPath: 'certs/AmazonRootCA1.pem',
    clientId: 'client-test-123',
    host: 'a4kiw8koxs6m7-ats.iot.us-east-1.amazonaws.com',
    debug: true,
  });

  const topicName = 'vincent-topic';

  vincentDevice.on('connect', function () {
    console.log('connected');
    vincentDevice.subscribe(topicName);
    vincentDevice.publish(topicName, JSON.stringify({
      message: 'Hello from WSL'
    }))
  });

  vincentDevice.on('message', function (topic, payload) {
    console.log(`Got message from topic ${topic}, payload ${payload.toString()}`);
  });

  let count = 1;
  const interval = setInterval(function () {
    if (count++ > 60) {
      clearInterval(interval);
    }
    vincentDevice.publish(topicName, JSON.stringify({
      message: 'New Message ' + count
    }));
  }, 1000);
}

main();