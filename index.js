/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * For additional samples, visit the Alexa Skills Kit developer documentation at
 * https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/getting-started-guide
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.DiceRoller") {
             context.fail("Invalid Application ID");
         }
*/

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                        context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        }  else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                         context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
                + ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
                + ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
                + ", sessionId=" + session.sessionId);


    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("RollSomeDie" === intentName) {
        rollSomeDie(intent, session, callback);
	} else if ("RoleDefaultDie" === intentName) {
		rollDefaultDie(intent, session, callback);		
    } else if ("HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
                + ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to dice roller, "
                + "Which kind of dice would you like me to roll?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
	var repromptText = "You can say, \"D6, D10 or D20\".";
    var shouldEndSession = false;

    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function roll(sides) {
	if (sides >= 0 && sides <= 20)
        return Math.floor(Math.random() * sides) + 1;
	return -1;
}

function rollSomeDie(intent, session, callback) {
    var cardTitle = intent.name;
    var sidesName = intent.slots.Sides.value;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";
    var repromptText = "";
    
    repromptText = "Did you want me to roll the die?";
    
	var sides = parseInt(sidesName);
	
    var n = roll(sides);
	if (n !== -1) {
        speechOutput = ["Your d", sidesName, "rolled a", n].join(" ");
    }
    else {
        speechOutput = ["I don't own a ", sidesName, "sided die."].join(" ");
    }
    callback(sessionAttributes,
             buildRollResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function rollDefaultDie(intent, session, callback) {
    var cardTitle = intent.name;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";
    var repromptText = "";
    
    repromptText = "Did you want me to roll the die?";
    
    var n = roll(20);
    speechOutput = ["Your d 20 rolled a", n].join(" ");
    callback(sessionAttributes,
             buildRollResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

var nameOfNumbers = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten",
    11: "eleven",
    12: "twelve",
    13: "thirteen",
    14: "fourteen",
    15: "fifteen",
    16: "sixteen",
    17: "seventeen",
    18: "eighteen",
    19: "nineteen",
    20: "twenty"
};

// --------------- Helpers that build all of the responses -----------------------


function buildRollResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        shouldEndSession: shouldEndSession
    }
}

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    }
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}