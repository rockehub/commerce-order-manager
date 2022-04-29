const fetch = require('node-fetch')
const base64 = require('base-64')

async function authenticate (data) {
  const response = await fetch(appHost + '/authenticate', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + base64.encode(basicUsername + ':' + basicPassword),
      Accept: '*/*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const resp = await response
  const $data = resp.json()
  if (!resp.ok) {
    // create error object and reject if not a 2xx data code
    const err = new Error(resp.statusText + ' ' + resp.status)
    err.data = resp
    err.status = resp.status
    throw err
  }
  return $data
}

async function login (data) {
  let response = await fetch(appHost + '/applogin', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + base64.encode(basicUsername + ':' + basicPassword),
      Accept: '*/*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  response = await response
  const $data = response.json()
  if (!response.ok) {
    // create error object and reject if not a 2xx response code
    const err = new Error(response.statusText + ' ' + response.status)
    err.response = response
    err.status = response.status
    throw err
  }
  return $data
}

async function logout (data) {
  const response = await fetch(appHost + '/logout', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + base64.encode(basicUsername + ':' + basicPassword),
      Accept: '*/*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  return await response.json()
}

module.exports = { authenticate, login, logout }
