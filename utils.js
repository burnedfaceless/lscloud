// node modules
const fs = require('fs')

// npm modules
const prettyjson = require('prettyjson')
const axios = require('axios')
const dateformat = require('dateformat')

const getCurrentDate = () => {
  const now = new Date()
  return dateformat(now, 'yyyy-mm-dd')
}

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
    const response = await axios.get('https://api.liftstation.cloud/v1/wells', {
      params: {
        api_key: credentials.api_key,
        api_secret: credentials.api_secret
      }
    })
    const options = {
      noColor: false
    }
    console.log(prettyjson.render(response.data, options))
  } catch(e) {
    if (e.response.status === 401) {
      await deleteCredentials()
      console.log('Invalid credentials \nRun lscloud config --help')
    }
  }
}

const forceWellReading = async(credentials, wellObj) => {
  try {
    const response = await axios.put('https://api.liftstation.cloud/v1/wells', {
      pump: wellObj.pump,
      residual: wellObj.residual,
      wellId: wellObj.id,
      date: wellObj.date
    }, {
      params: {
        api_key: credentials.api_key,
        api_secret: credentials.api_secret
      }
    })
    console.log('success')
  } catch(e) {
    if (e.response.status === 401) {
      await deleteCredentials()
      console.log('Invalid credentials \nRun lscloud config --help')
    }
  }
}

const pushWellReading = async(credentials, wellObj) => {
  try {
    const response = await axios.post('https://api.liftstation.cloud/v1/wells', {
      pump: wellObj.pump,
      residual: wellObj.residual,
      wellId: wellObj.id,
      date: wellObj.date
    }, { params: {
        api_key: credentials.api_key,
        api_secret: credentials.api_secret
      }
    })
    console.log('success')
  } catch(e) {
    if (e.response.status === 401) {
      await deleteCredentials()
      console.log('Invalid credentials \nRun lscloud config --help')
    }
    if (e.response.status === 409) {
      if (wellObj.force === true) {
        await forceWellReading(credentials, wellObj)
      } else {
        console.log('A reading already exists for this date \nRun with --force=true to force the readings to be entered')
      }
    }
  }
}

const validatePump = pump => {
  return /^[0-9]{1,9}$/.test(pump)
}

const validateResidual = residual => {
  return (residual === null) ? true : /^[0-9]\.[0-9]$/.test(residual)
}

const validateDate = date => {
  return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)
}



module.exports = {
  checkForApiCredentials,
  writeApiCredentials,
  parseApiCredentials,
  getWells,
  pushWellReading,
  getCurrentDate,
  validatePump,
  validateResidual,
  validateDate
}