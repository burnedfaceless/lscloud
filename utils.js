// node modules
const fs = require('fs')

// npm modules
const got = require('got')
const prettyjson = require('prettyjson')

const readCredentialsFile = () => {
  return fs.readFileSync(__dirname + '/.credentials.json', 'utf8')
}

const checkForApiCredentials = () => {
  try {
    const data = readCredentialsFile()
    return true
  } catch(e) {
    if (e.errno === -2) {
      console.log('You need to enter your API Credentials\nRun lscloud config --help')
    }
    return false
  }
}

const parseApiCredentials = () => {
  const data = readCredentialsFile()
  return JSON.parse(data)
}

const writeApiCredentials = (apiKey, apiSecret) => {
  try {
    const credentials = JSON.stringify({
      "api_key": apiKey,
      "api_secret": apiSecret
    })
    fs.writeFileSync(__dirname + '/.credentials.json', credentials)
  } catch(e) {
    console.log(e)
  }
}

const deleteCredentials = async() => {
  try {
    fs.unlinkSync(__dirname + '/.credentials.json')
  } catch(e) {
    console.log(e)
  }
}

const getWells = async(credentials) => {
  try {
    const response = await got(`https://api.liftstation.cloud/v1/wells?api_key=${credentials.api_key}&api_secret=${credentials.api_secret}`)
    const options = {
      noColor: false
    }
    console.log(prettyjson.render(JSON.parse(response.body), options))
  } catch(e) {
    if (e.message === 'Response code 401 (Unauthorized)') {
      await deleteCredentials()
      console.log('Invalid credentials \nRun lscloud config --help')
    }
  }
}

module.exports = {
  checkForApiCredentials,
  writeApiCredentials,
  parseApiCredentials,
  getWells
}