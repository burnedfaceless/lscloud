#!/usr/bin/env node
const yargs = require('yargs')
const got = require('got')

// Functions
const {
  checkForApiCredentials,
  writeApiCredentials,
  parseApiCredentials,
  getWells
} = require('./utils')

yargs.command({
  command: 'config',
  describe: 'Enter your API Credentials',
  builder: {
    api_key: {
      describe: 'Your API Key',
      demandOption: true,
      type: 'string'
    },
    api_secret: {
      describe: 'Your API Secret',
      demandOption: true,
      type: "string"
    }
  },
  handler(argv) {
    writeApiCredentials(argv.api_key, argv.api_secret)
  }
})

yargs.command({
  command: 'get wells',
  describe: 'Retrieve a list of wells. Used to retrieve the ID of a well to push readings to the cloud.',
  handler() {
    const credentialsExist = checkForApiCredentials()
    if (credentialsExist) {
      const credentials = parseApiCredentials()
      getWells(credentials)
    }
  }
})

yargs.command({
  command: 'push well reading',
  describe: 'Push a well reading to the cloud.',
  builder: {
    id: {
      describe: 'Well ID',
      demandOption: true,
      type: 'string'
    },
    pump: {
      describe: 'Pump reading',
      demandOption: true,
      type: 'string'
    },
    date: {
      describe: 'Date of reading. If omitted lscloud will use the system date.',
      demandOption: false,
      type: 'string'
    },
    residual: {
      describe: 'Chlorine residual. May be omitted.',
      demandOption: false,
      type: 'string'
    }
  },
  handler(argv) {
    const credentialsExist = checkForApiCredentials()
    if (credentialsExist) {
      console.log('hello')
    }
  }
})

yargs.command({
  command: '*',
  handler() {
    yargs.showHelp()
  }
})

yargs.parse()
