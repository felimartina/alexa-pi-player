process.env.ALEXA_APP_ID = 'amzn1.ask.skill.7001acac-2cbe-4c23-9b2b-bfc29e49ffbf'
process.env.DEVICE_URI = 'http://50.113.42.119:49012'
process.env.DEVICE_API_VERSION = 'v2'
process.env.VERBOSE = '0'

const lambda = require('./index')
const context = {
  succeed: (any) => {
    console.log(JSON.stringify(any))
  },
  fail: (any) => {
    console.log(JSON.stringify(any))
  }
}
const mockEvent = {
  "version": "1.0",
  "session": {
    "new": false,
    "sessionId": "amzn1.echo-api.session.cdceb47a-1d8b-4703-aab1-0df7ce916fb3",
    "application": {
      "applicationId": "amzn1.ask.skill.7001acac-2cbe-4c23-9b2b-bfc29e49ffbf"
    },
    "attributes": {
      "speechOutput": "Welcome to Pi Player",
      "repromptSpeech": "For instructions on what you can say, please say help me."
    },
    "user": {
      "userId": "amzn1.ask.account.AFJ2U76DVEMOYMXH2UGBVO2YG7BGRDPI2H4G3YGDTIDWYH2BBR7WKJLGUO7TGFLOEAMTEHVIVCFNFWZXNJTO2HW3OBK6OM57HQOWVPA3V443J5L7E3LZZS4FVI2O2VRJA2F5Y3CPC3FJ5JSXVANCJJKAQNMW5TQCZ6ZX33FBQXTS4KAH46LZCVUUEINJFX5JRZM23GV7EMBJ5PY"
    }
  },
  "context": {
    "AudioPlayer": {
      "playerActivity": "IDLE"
    },
    "System": {
      "application": {
        "applicationId": "amzn1.ask.skill.7001acac-2cbe-4c23-9b2b-bfc29e49ffbf"
      },
      "user": {
        "userId": "amzn1.ask.account.AFJ2U76DVEMOYMXH2UGBVO2YG7BGRDPI2H4G3YGDTIDWYH2BBR7WKJLGUO7TGFLOEAMTEHVIVCFNFWZXNJTO2HW3OBK6OM57HQOWVPA3V443J5L7E3LZZS4FVI2O2VRJA2F5Y3CPC3FJ5JSXVANCJJKAQNMW5TQCZ6ZX33FBQXTS4KAH46LZCVUUEINJFX5JRZM23GV7EMBJ5PY"
      },
      "device": {
        "deviceId": "amzn1.ask.device.AGP2LB6FSNB3HMCAJM5WYRYZYV233ZXIUTO5BW4W5K7GCBULOSBUWX55LOGK45ICPQZSNVRSYSGEER6HYIPHSYBDVUKLOWPYSMOYECVROYHDNGSLS7IKPLYRW55BUY7NN6CR5CZL7WQWABSAT7G3PXF3A3FQ",
        "supportedInterfaces": {
          "AudioPlayer": {}
        }
      },
      "apiEndpoint": "https://api.amazonalexa.com"
    }
  },
  "request": {
    "type": "IntentRequest",
    "requestId": "amzn1.echo-api.request.15db1c5c-68ab-41b4-9a44-9f4a1b7d618b",
    "timestamp": "2017-09-15T01:57:49Z",
    "locale": "en-US",
    "intent": {
      "name": "Play",
      "confirmationStatus": "NONE",
      "slots": {
        "Episode": {
          "name": "Episode",
          "value": "50",
          "confirmationStatus": "NONE"
        },
        "Series": {
          "name": "Series",
          "value": "las estrellas",
          "resolutions": {
            "resolutionsPerAuthority": [
              {
                "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.7001acac-2cbe-4c23-9b2b-bfc29e49ffbf.Series",
                "status": {
                  "code": "ER_SUCCESS_MATCH"
                },
                "values": [
                  {
                    "value": {
                      "name": "Las Estrellas",
                      "id": "eddfdbd02ff2164048a79388cd17c10c"
                    }
                  }
                ]
              }
            ]
          },
          "confirmationStatus": "NONE"
        },
        "Season": {
          "name": "Season",
          "confirmationStatus": "NONE"
        }
      }
    },
    "dialogState": "STARTED"
  }
}
lambda.handler(mockEvent, context)