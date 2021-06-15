#!/usr/bin/env node
const yargs = require('yargs')

// Functions
const {
  checkForApiCredentials,
  writeApiCredentials,
  parseApiCredentials,
  getWells,
  pushWellReading,
  getCurrentDate,
  validateDate,
  validateResidual,
  validatePump
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
  describe: 'Retrieve the name and id of your organization\'s wells.',
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
    },
    force: {
      describe: 'Force reading to overwrite existing reading for this date and well',
      demandOption: false,
      type: 'boolean'
    }
  },
  handler(argv) {
    const credentialsExist = checkForApiCredentials()
    if (credentialsExist) {
      const wellReading = {}
      wellReading.id = argv.id
      wellReading.pump = argv.pump
      wellReading.date = (argv.date === undefined) ? getCurrentDate() : argv.date
      wellReading.residual = (argv.residual === undefined) ? null : argv.residual
      wellReading.force = (argv.force === undefined) ? false : argv.force
      const credentials = parseApiCredentials()
      if (validateResidual(wellReading.residual) && validatePump(wellReading.pump) && validateDate(wellReading.date)) {
        pushWellReading(credentials, wellReading)
      } else {
        if (!validateDate(wellReading.date)) {
          console.log('Your date is incorrect')
        }
        if (!validatePump(wellReading.pump)) {
          console.log('Your pump is incorrect')
        }
        if (!validateResidual(wellReading.residual)) {
          console.log('Your residual is incorrect')
        }
      }
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
