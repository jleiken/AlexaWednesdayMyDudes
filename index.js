/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk');
const https = require('https');

const itis = "https://s3.amazonaws.com/all-star-bucket/itis.mp3";
const ahh = "https://s3.amazonaws.com/all-star-bucket/ahh.mp3";
const itiswed = "https://s3.amazonaws.com/all-star-bucket/itiswed.mp3";
const dayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const handlers = {
  'LaunchRequest': function () {
    let accessToken = this.event.context.System.apiAccessToken;
    let deviceId = this.event.context.System.device.deviceId;
    
    const options = {
      hostname: "api.amazonalexa.com",
      path: `/v2/devices/${deviceId}/settings/System.timeZone`,
      headers: {"Authorization": `Bearer ${accessToken}`}
    };
    let alexaThis = this;
    https.get(options, function (res) {
      res.on('data', function (d) {
        let tz = JSON.parse(d.toString());
        let day = new Date(new Date().toLocaleString('en-US', {timeZone: tz})).getDay();
        alexaThis.emit(":tell", stringByDay(day));
      });
    }).on('error', function (e) {
      console.log("error");
      console.log(e);
      alexaThis.emit(":tell", stringByDay(new Date().getDay()));
    });
  },
  'AMAZON.CancelIntent': function () {
    this.emit(":tell", "");
  },
  'AMAZON.StopIntent': function () {
    this.emit(":tell", "");
  },
  'Unhandled': function () {
    this.emit(":tell", "");
  },
  'AMAZON.HelpIntent': function () {
    this.emit(":tell", "");
  },
  'Intent': function () {
    this.emit('LaunchRequest');
  }
};

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

function stringByDay(day) {
  if (day === 3) {
    return `<audio src="${itiswed}" />`;
  } else {
      return `<audio src="${itis}" /> ${dayArr[day]} <audio src="${ahh}" />`;
  }
}
