import awsIoT from 'aws-iot-device-sdk';

async function simulateProcessing(fn: (percentage: number) => void) {
  let i = 10;
  await new Promise((resolve, reject) => {
    const interval = setInterval(function () {
      if (i === 100) {
        clearInterval(interval);
        resolve(true)
      }
      fn(i);
      i += 10;
    }, 1000);
  })
}

async function main() {
  const jobs = new awsIoT.jobs({
    keyPath: 'certs/c1c5ef35d2-private.pem.key',
    certPath: 'certs/c1c5ef35d2-certificate.pem.crt',
    caPath: 'certs/AmazonRootCA1.pem',
    clientId: 'client-test-123',
    host: 'a4kiw8koxs6m7-ats.iot.us-east-1.amazonaws.com',
    // debug: true,
  });

  const topicName1 = '$aws/things/MyTestThing/jobs/notify';
  const topicName2 = 'topic_2';

  jobs.on('connect', function () {
    console.log('connected');
    jobs.subscribe(topicName1);
    jobs.publish(topicName2, JSON.stringify({
      message: 'Hello from WSL'
    }));
  });

  jobs.on('message', function (topic, payload) {
    console.log(`Got message from topic ${topic}, payload ${payload.toString()}`);
  });

  const thingName = 'MyTestThing';
  const jobName = 'MyTestThing';

  // jobs.subscribeToJobs(thingName, '', function(error, job) {
  //   console.log("🚀 ~ file: job-class.ts ~ line 32 ~ jobs.subscribeToJobs ~ error, job", error, job)
  //   if(error === undefined) {
  //     console.log('customJob operation handler invoked, jobId: ' + job.id.toString());
  //     console.log('job document: ' + job.document);
  //     job.failed({
  //       progress: 'Explicitly set fail'
  //     });
  //   } else {
  //     console.error(error)
  //   }
  // });

  jobs.subscribeToJobs(thingName, 'install', async function (error, job) {
    if (error !== undefined) {
      console.log('customJob operation handler invoked, jobId: ' + job.id.toString());
      console.log(job.status);
      console.log(job.document);

      await simulateProcessing((percentate: number) => {
        console.log("🚀 ~ file: job-class.ts ~ line 60 ~ simulateProcessing ~ percentate", percentate)
        job.inProgress({ 
          progress: `${percentate}%`,
         }, function (error) {
          if (error !== undefined) {
            console.log(`Updated progress ${percentate} %`)
          } else {
            // console.warn('Updating progress failed', error);
            // job.failed({ progress: `${percentate}%`}, function(error) {
            //   if(error) {
            //     console.warn('Update "failed" failed')
            //   }
            // })
          }
        });
      });
      job.succeeded({progress: '100%'}, function(error) {
        if(error) {
          console.log('Update "Succeeded" status failed');
        }
      })
    } else {
      console.error(error);
    }
  });

  jobs.startJobNotifications(thingName, function (error) {
    if (error === undefined) {
      console.log(`Job noti initiated for thing ${thingName}`);
    } else {
      console.error(error)
    }
  })
}

main();