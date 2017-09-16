/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"] */
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict'

const Alexa = require('alexa-sdk')
const request = require('request')

const ALEXA_APP_ID = process.env.ALEXA_APP_ID
const DEVICE_URI = process.env.DEVICE_URI
const DEVICE_API_VERSION = process.env.DEVICE_API_VERSION
const VERBOSE = process.env.VERBOSE
const languageStrings = {
  'en': {
    translation: {
      SKILL_NAME: 'Pi Player',
      NOT_READY: 'I\'m not ready yet...',
      WELCOME_MESSAGE: 'Welcome to %s',
      WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
      PLAYING: 'Playing %s',
      DISPLAY_CARD_TITLE: '%s  - Recipe for %s.',
      HELP_MESSAGE: 'You can ask me things such as, play Las Estrellas, or, Play Stars episode 60...Now, what can I help you with?',
      HELP_REPROMPT: 'You can say things like, play Stars episode 60, or you can say exit...Now, what can I help you with?',
      STOP_MESSAGE: 'Goodbye!',
      NOT_FOUND_MESSAGE: `I'm sorry, I didn't find a show named %s`
    }
  }
  // 'en-US': {
  //     translation: {
  //         RECIPES: recipes.RECIPE_EN_US,
  //         SKILL_NAME: 'American Minecraft Helper',
  //     },
  // },
  // 'en-GB': {
  //     translation: {
  //         RECIPES: recipes.RECIPE_EN_GB,
  //         SKILL_NAME: 'British Minecraft Helper',
  //     },
  // }
}

const handlers = {
  'LaunchRequest': function () {
    this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'))
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT')
    this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech)
  },
  'Play': function () {
    console.log(this.event.request.intent.slots)
    const seriesSlot = this.event.request.intent.slots.Series
    const seasonSlot = this.event.request.intent.slots.Season
    const episodeSlot = this.event.request.intent.slots.Episode
    if (seriesSlot && seriesSlot.value) {
      const playRequest = {
        name: seriesSlot.value
      }
      if (seasonSlot && seasonSlot.value && seasonSlot.value) playRequest.season = parseInt(seasonSlot.value)
      if (episodeSlot && episodeSlot.value && episodeSlot.value) playRequest.episode = parseInt(episodeSlot.value)
      // Call the device and make it play the given series
      const requestOptions = {
        method: 'POST',
        uri: `${DEVICE_URI}/${DEVICE_API_VERSION}/web`,
        body: playRequest,
        headers: {
          'Content-Type': 'application/json'
        },
        json: true
      }
      request(requestOptions, (error, response) => {
        if (error) {
          console.log(error)
          this.emit(':ask', this.t('NOT_FOUND_MESSAGE', seriesSlot.value))
        }
        console.log(response)
        return this.emit(':ask', this.t('PLAYING', seriesSlot.value))
      })
    }

    // this.emit(':ask', this.attributes.speechOutput)
    // const seriesSlot = this.event.request.intent.slots.Item;
    // let itemName;
    // if (itemSlot && itemSlot.value) {
    //     itemName = itemSlot.value.toLowerCase();
    // }

    // const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
    // const myRecipes = this.t('RECIPES');
    // const recipe = myRecipes[itemName];

    // if (recipe) {
    //     this.attributes.speechOutput = recipe;
    //     this.attributes.repromptSpeech = this.t('RECIPE_REPEAT_MESSAGE');
    //     this.emit(':askWithCard', recipe, this.attributes.repromptSpeech, cardTitle, recipe);
    // } else {
    //     let speechOutput = this.t('RECIPE_NOT_FOUND_MESSAGE');
    //     const repromptSpeech = this.t('RECIPE_NOT_FOUND_REPROMPT');
    //     if (itemName) {
    //         speechOutput += this.t('RECIPE_NOT_FOUND_WITH_ITEM_NAME', itemName);
    //     } else {
    //         speechOutput += this.t('RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME');
    //     }
    //     speechOutput += repromptSpeech;

    //     this.attributes.speechOutput = speechOutput;
    //     this.attributes.repromptSpeech = repromptSpeech;

    //     this.emit(':ask', speechOutput, repromptSpeech);
    // }
  },
  'AMAZON.HelpIntent': function () {
    this.attributes.speechOutput = this.t('HELP_MESSAGE')
    this.attributes.repromptSpeech = this.t('HELP_REPROMPT')
    this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech)
  },
  'AMAZON.RepeatIntent': function () {
    this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech)
  },
  'AMAZON.StopIntent': function () {
    this.emit('SessionEndedRequest')
  },
  'AMAZON.CancelIntent': function () {
    this.emit('SessionEndedRequest')
  },
  'SessionEndedRequest': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'))
  },
  'Unhandled': function () {
    this.attributes.speechOutput = this.t('HELP_MESSAGE')
    this.attributes.repromptSpeech = this.t('HELP_REPROMPT')
    this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech)
  }
}

exports.handler = function (event, context) {
  if (VERBOSE === '1') console.log(JSON.stringify(event))

  const alexa = Alexa.handler(event, context)
  alexa.APP_ID = ALEXA_APP_ID
  // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = languageStrings
  alexa.registerHandlers(handlers)
  alexa.execute()
}
