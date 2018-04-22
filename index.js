'use strict';
const Alexa = require('alexa-sdk');
var http = require("http");

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

const APP_ID = 'amzn1.ask.skill.29644478-8ace-4b44-b5e4-e01f0566424e';
const HELP_MESSAGE = 'You need Help. Got it. Basically you can set up a train for once and you can check the status of it by asking, where is my train. If you would like like to try, Please say, Set up.';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Thanks for using the app. Goodbye!';

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask','Welcome. Please say set up, to set up your train');
    },
    'Setupmytrain': function () {
        this.emit(':ask','Whats the train number');
    },
    'GetMyTrainNumber': function() {
     //Save the this object before calling extrnal API
        const that = this;
        var Train_Number = "0";
        
        if (this.event.request.intent.slots.TrainNumber && this.event.request.intent.slots.TrainNumber.value != undefined)
           Train_Number = this.event.request.intent.slots.TrainNumber.value;
           
        if (Train_Number == "?")
           Train_Number = "0";
           
         if (Train_Number != "0") //Call External API and check for validity of Train number
        {
        var http = require('http');
          http.get({ host: 'mytestwebappforqaadvisor.azurewebsites.net', path: '/train/CheckTrainNumber/' + Train_Number }, function(response) {
           var body = ''; 
          response.on('data', function(d) { body += d; }); 
          response.on('end', function() { // Data reception is done, do whatever with it! 
          var result1 = JSON.parse(body);
          var strMsg= result1.Message;
          if (result1.TrainNumberValid == "1") //Set from backend if train is valid
            that.attributes['TrainNumberSess'] = Train_Number; //Store in session using Dynamodb
        var outputSpeech = strMsg;
         that.emit(':ask',outputSpeech);
          })
            })
        }
        else // If by any chance Train number slot is empty of undefined
        {
        var outputSpeech = "Well, I didnt get that train number. Please say the train number to set up your train.";
        that.emit(':ask',outputSpeech); 
        }
    },
    'ProceedForSetup': function () {
        const that = this;
        var TrainNumberFromSess = 0;
        var Alexa_SessionID =  this.event.session.user.userId;
        Alexa_SessionID = Alexa_SessionID.replace(/\./g,'');//to replace the dot in session id
        TrainNumberFromSess = this.attributes['TrainNumberSess']; //retrieve the train number from session 
        
        if (TrainNumberFromSess != 0) //Call external API and setup your train in database.
        {
        var http = require('http');
          http.get({ host: 'mytestwebappforqaadvisor.azurewebsites.net', path: '/train/SetupMyTrain/' + TrainNumberFromSess + "/" + Alexa_SessionID }, function(response) {
           var body = ''; 
          response.on('data', function(d) { body += d; }); 
          response.on('end', function() { // Data reception is done, do whatever with it! 
          var result1 = JSON.parse(body);
          var strMsg= result1.Message;
          if (result1.SetUpStatus == "1")
            that.attributes['TrainNumberSess'] = 0; //Clear the session once set up is complete.
        var outputSpeech = strMsg;
        that.emit(':ask',outputSpeech);    
          })
            })
        }
        else // if the user says proceed, without even setting up the train
        {
            var outputSpeech = "Well, I didnt get that. To set up your train, Please say set up. To know the status, say where is my train.";
        that.emit(':ask',outputSpeech); 
        }
    },
    'WhereIsMyTrain': function() {
        const that = this;
        var Alexa_SessionID =  this.event.session.user.userId;
        Alexa_SessionID = Alexa_SessionID.replace(/\./g,'');
        
        var http = require('http'); // fetches the train based on the train number stored for that user (mapped with session id)
          http.get({ host: 'mytestwebappforqaadvisor.azurewebsites.net', path: '/train/GetTrainStatus/' + Alexa_SessionID }, function(response) {
           var body = ''; 
          response.on('data', function(d) { body += d; }); 
          response.on('end', function() { // Data reception is done, do whatever with it! 
          var result1 = JSON.parse(body);
          var strMsg= result1.Message;
        var outputSpeech = strMsg;
        that.emit(':tell',outputSpeech); 
          })
            })
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.dynamoDBTableName = 'MatTrainDB'; //To store the session in DynamoDB
    alexa.registerHandlers(handlers);
    alexa.execute();
};
