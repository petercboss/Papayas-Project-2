// Copyright 2018, Google, LLC.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const { google } = require('googleapis');
const sampleClient = require('./sampleClient');

const gmail = google.gmail({
  version: 'v1',
  auth: sampleClient.oAuth2Client
});

/**
 * NOTE: Before using this API, you need to do a few things.
 * 1. Create a new Pub/Sub topic.  You can use the command:
 *      gcloud pubsub topics create gmail
 * 2. Go to the Cloud Developer Console, and give the gmail
 *    service account gmail-api-push@system.gserviceaccount.com
 *    Pub/Sub Publisher rights to your newly created topic.
 *    https://console.cloud.google.com/cloudpubsub/topicList?project=${PROJECT_NAME}
 */
function runSample (callback) {
  gmail.users.watch({
    userId: 'me',
    resource: {
      // Replace with `projects/${PROJECT_ID}/topics/${TOPIC_NAME}`
      topicName: `rojects/gmail-project-1521649606162/topics/bentest`
    }
  }, (err, res) => {
    if (err) {
      throw err;
    }
    console.log(res.data);
    callback(res.data);
  });
}

if (module === require.main) {
  const scopes = [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.metadata',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.readonly'
  ];
  sampleClient.authenticate(scopes, err => {
    if (err) {
      throw err;
    }
    runSample(() => { 
        console.log(scopes);
    });
  });
}

module.exports = {
  runSample,
  client: sampleClient.oAuth2Client
};