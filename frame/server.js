// Internal Dependencies
const { ipcRenderer } = require('electron')
const jspack = require('../package.json')
global.appVersion = jspack.version
const _ = require('lodash')
const maxResBtn = document.getElementById('maxResBtn')
let expressAppUrl = 'http://locahost:3326'

spanversion = document.getElementById('appVersion')
spanversion.innerHTML = appVersion;

closeBtn.addEventListener('click', () => {
    ipcRenderer.send('closeApp')
})
minimizeBtn.addEventListener('click', () => {
    ipcRenderer.send('minimizeApp')
})
maxResBtn.addEventListener('click', () => {
    ipcRenderer.send('maximizeApp')
})

menuShow.addEventListener('click', () => {
    ipcRenderer.send('display-app-menu')
})

function changeMaxBtn(isMaximizedApp) {
    console.log('chega Aqui')
    if (isMaximizedApp) {
        maxResBtn.title = 'Restore'
        const icon = maxResBtn.firstElementChild
        icon.classList.remove('fa-window-maximize')
        icon.classList.add('fa-window-restore')
    } else {
        maxResBtn.title = 'Maximize'
        const icon = maxResBtn.firstElementChild
        icon.classList.remove('fa-window-restore')
        icon.classList.add('fa-window-maximize')
    }
}

ipcRenderer.on('isMaximized', () => {
        console.log('chega')
        changeMaxBtn(true)
    }
)
ipcRenderer.on('isRestored', () => {
        changeMaxBtn(false)
    }
)

setInterval(async () => {
    getNotification().then((response) => {
        console.log(response)
        ipcRenderer.send('show_notification', response)
        // eslint-disable-next-line node/handle-callback-err
    }).catch((err) => {
        console.log(err)
    })
}, 300000)

setInterval(async () => {
    getOrder().then((response) => {
        if (response.newOrder == true) {
            ipcRenderer.send('show_newOrder', response)
        }
        // eslint-disable-next-line node/handle-callback-err
    }).catch((err) => {
        console.log(err)
    })
}, 300000)

async function getNotification() {
    let data = await fetch(expressAppUrl + '/notification', {
        method: 'GET',
        headers: {
            Accept: '*/*',
            'Content-Type': 'application/json'
        }
    })
    data = await data
    const $data = data.json()
    if (!data.ok) {
        // create error object and reject if not a 2xx data code
        const err = new Error(data.statusText + ' ' + data.status)
        err.data = data
        err.status = data.status
        throw err
    }
    return $data
}

async function getOrder() {
    let data = await fetch(expressAppUrl + '/newOrder', {
        method: 'GET',
        headers: {
            Accept: '*/*',
            'Content-Type': 'application/json'
        }
    })
    data = await data
    const $data = data.json()
    if (!data.ok) {
        // create error object and reject if not a 2xx data code
        const err = new Error(data.statusText + ' ' + data.status)
        err.data = data
        err.status = data.status
        throw err
    }
    return $data
}
