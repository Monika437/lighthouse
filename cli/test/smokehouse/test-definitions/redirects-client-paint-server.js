/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/** @type {LH.Config} */
const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'interactive',
      'speed-index',
      'redirects',
    ],
    // Use provided throttling method to test usage of correct navStart.
    throttlingMethod: /** @type {const} */ ('provided'),
  },
};

/**
 * @type {Smokehouse.ExpectedRunnerResult}
 * Expected Lighthouse audit values for a site with a client-side redirect (2s + 5s),
 * paints at 2s, then a server-side redirect (1s).
 */
const expectations = {
  // TODO: Assert performance metrics on client-side redirects, see https://github.com/GoogleChrome/lighthouse/pull/10325
  lhr: {
    requestedUrl: `http://localhost:10200/js-redirect.html?delay=2000&jsDelay=5000&jsRedirect=%2Fonline-only.html%3Fdelay%3D1000%26redirect%3D%2Fredirects-final.html`,
    finalDisplayedUrl: 'http://localhost:10200/redirects-final.html',
    audits: {
      // Just captures the server-side at the moment, should be 8s in the future
      'first-contentful-paint': {
        numericValue: '>=1000',
      },
      'interactive': {
        numericValue: '>=1000',
      },
      'speed-index': {
        numericValue: '>=1000',
      },
      'redirects': {
        score: '<1',
        numericValue: '>=8000',
        details: {
          items: {
            length: 3,
          },
        },
      },
    },
    runWarnings: [
      /The page may not be loading as expected because your test URL \(.*js-redirect.html.*\) was redirected to .*redirects-final.html. Try testing the second URL directly./,
    ],
  },
};

export default {
  id: 'redirects-client-paint-server',
  expectations,
  config,
};
