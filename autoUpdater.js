'use strict'
const os = require('os')
const { app, autoUpdater, dialog ,Notification} = require('electron')
const version = app.getVersion()
const platform = os.platform() + '_' + os.arch() // usually returns darwin_64

const updaterFeedURL = 'https://app-com-mi.herokuapp.com/update/' + platform + '/v' + version

// replace updaterFeedURL with http://yourappname.herokuapp.com

function appUpdater() {
    autoUpdater.setFeedURL(updaterFeedURL)
    /* Log whats happening
    TODO send autoUpdater events to renderer so that we could console log it in developer tools
    You could alsoe use nslog or other logging to see what's happening */
    autoUpdater.on('error', err => console.log(err))
    autoUpdater.on('checking-for-update', () =>{
        new Notification({ title: 'Client Updater', body:'Procurando Por Atualizações' }).show()
    })
    autoUpdater.on('update-available', () => {
        new Notification({ title: 'Client Updater', body:'Atualização Encontrada! efetuando Download você será notificado quando terminar' }).show()
    })
    autoUpdater.on('update-not-available', () => {
        new Notification({ title: 'Client Updater', body:'Nenhuma atualização disponivel' }).show()
    })

    // Ask the user if update is available
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        let message = app.getName() + ' ' + releaseName + ' is now available. It will be installed the next time you restart the application.'
        if (releaseNotes) {
            const splitNotes = releaseNotes.split(/[^\r]\n/)
            message += '\n\nRelease notes:\n'
            splitNotes.forEach(notes => {
                message += notes + '\n\n'
            })
        }
        // Ask user to update the app
        dialog.showMessageBox({
            type: 'question',
            buttons: ['Install and Relaunch', 'Later'],
            defaultId: 0,
            message: 'A new version of ' + app.getName() + ' has been downloaded',
            detail: message
        }, response => {
            if (response === 0) {
                setTimeout(() => autoUpdater.quitAndInstall(), 1)
            }
        }).then((response) => {
            if (response === 0) {
                setTimeout(() => autoUpdater.quitAndInstall(), 1)
            }
        })
    })
    // init for updates
    autoUpdater.checkForUpdates()
}

exports = module.exports = {
    appUpdater
}
