import { thingShadow } from 'aws-iot-device-sdk';

async function main() {
  const thingDevice = new thingShadow({
    keyPath: 'certs/c1c5ef35d2-private.pem.key',
    certPath: 'certs/c1c5ef35d2-certificate.pem.crt',
    caPath: 'certs/AmazonRootCA1.pem',
    clientId: 'client-test-123',
    host: 'a4kiw8koxs6m7-ats.iot.us-east-1.amazonaws.com',
    debug: true,
  });

  let clientTokenUpdate;
  let rval = 187;
  let gval = 114;
  let bval = 222;

  thingDevice.on('connect', function () {
    thingDevice.register('MyTestShadoww', {
      ignoreDeltas: true,
    }, function () {
      console.log('connected');
      const rgbLedLampState = { "state": { "desired": { "red": rval, "green": gval, "blue": bval } } };
      const thingUpdate = thingDevice.update('MyTestShadoww', rgbLedLampState);
      clientTokenUpdate = thingUpdate ? thingUpdate : null;
      console.log("🚀 ~ file: thing-shadow.ts ~ line 25 ~ clientTokenUpdate", clientTokenUpdate);

      if (clientTokenUpdate === null) {
        console.log('update shadow failed, operation still in progress');
      }
    });
  });

  thingDevice.on('status', function (thingName, stat, clientToken, stateObject) {
    console.log('received ' + stat + ' on ' + thingName + ': ' +
      JSON.stringify(stateObject));
  });

  thingDevice.on('delta', function (thingName, stateObject) {
    console.log('received delta on ' + thingName + ': ' +
      JSON.stringify(stateObject));
  });

  thingDevice.on('timeout', function (thingName, clientToken) {
    console.log('received timeout on ' + thingName +
      ' with token: ' + clientToken);
  });

  thingDevice.on('offline', function() {
    console.log('offline')
  });
  thingDevice.on('reconnect', function() {
    console.log('reconnect')
  });
  thingDevice.on('close', function() {
    console.log('close')
  });
}

main();