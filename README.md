# Train-Skill
The whole idea of this skill is get the current running live status of a train by asking "Where is my train"
# About
• The whole idea of this skill is get the current running live status of a train by asking "Where is my train". 
• To make it a bit more user friendly, I have divided this skill into two parts 
		a) Setting up the train the user generally commute daily. As an analogy, one can think about like adding to favorites. (This is basicaly a mapping of Alexa User Session id with the Train number in the database).
		b) Next time onwards, he just need to invoke the skill and ask "Where is my train" and the response will be like "Your train has just crossed  Bangalore and is running late by 20 minutes".
		c) Note:- Future enhancement of this skill - User shall receive a push notification through Alexa when the train crosses a specific station - which is captured during the setup process. Once Alexa push notifications are ready, user will get a notification like "Wake up, your train has crossed Ernakulam Junction". 
# Usage
Alexa, ask mat train.
	>> "Welcome. Please say set up to set up your train".
# Repository Contents	
index.js
Voice UI Skills JSON

# Instructions to run

For Alexa Skills UI
	1) After creating a new skill , click on the JSON editor and replace with the Skill JSON file which creates the Intents, slots and other details.

For Lambda
	1) While creating the Lambda function I have used the Blueprint alexa-skill-kit-sdk-factskill so that it creates all the Alexa-sdk related files.
	2) Replaced the index.js with the code I have incorporated. 

To invoke the skill say, 

User: "Alexa open mat train"

Skill: " Welcome back. Please say, set up to set up your train "

User: "set up my train"

Skill: " Whats the train number "

User: "one six five two six"

Skill: " Ok. So you would like to set up the train 1 6 5 2 6 which is KANYAKUMARI Express. If this is correct, please say, Proceed. "

User: "proceed"

Skill: " Perfect. You have Successfully set up your Train. If you would like to know status of your train now, you can say, Where is my train. "

User: "where is my train"

Skill: "Train departed from BANGALORE CANT and late by 3 minutes."

User can also ask for Help to know the details about this skill.

