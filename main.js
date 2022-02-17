/*
 * Copyright (C) 2017 Jason Henderson
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */
// todo adicionar função que cria as pastas


// The big boy
const electron = require('electron');

// Module to control application life.
const app = electron.app;
const ipcMain = electron.ipcMain
const ipc = ipcMain
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const isDev = require('electron-is-dev')
require('dotenv').config({ path: require('find-config')('.env') })
const { appUpdater } = require('./autoUpdater')

// Setup the logging for the app to write to the console (developer tools),
// as well as a file located at ~/Library/Logs/[productName]
const log = require('electron-log');

function isWindowsOrmacOS() {
    return process.platform === 'darwin' || process.platform === 'win32'
}

if (require('electron-squirrel-startup')) app.quit()

log.transports.console.level = 'info';
log.transports.file.level = 'info';


const os = require('os');
const path = require('path');
const url = require('url');
const { dialog, Notification, globalShortcut } = require("electron");

// Name of the product, used in some app labels
const productName = require('./package.json').productName;
const isWindows = process.platform === "win32";

var home = require("os").homedir();

var fs = require('fs');
const {spawn} = require("child_process");

var dir = home + '/Documents/COMNotesFolder/background';
var dir2 = home + '/Documents/COMNotesFolder/files';

if (process.platform === 'win32') {
    var dir = home + '\\Documents\\COMNotesFolder\\background';
    var dir2 = home + '\\Documents\\COMNotesFolder\\files';
}

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
        recursive: true
    });
}
if (!fs.existsSync(dir2)) {
    fs.mkdirSync(dir2, {
        recursive: true
    });
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;
var webServer;
var shuttingDown;

function startExpress() {

    // Create the path of the express server to pass in with the spawn call
    var webServerDirectory = path.join(__dirname, 'http', 'bin', 'www');
    log.info('starting node script: ' + webServerDirectory);
    var nodePath = "/usr/local/bin/node";

    if (process.platform === 'win32') {
        nodePath = "C:\\Program Files\\nodejs\\node.exe";
    }

    // Optionally update environment variables used
    var env = JSON.parse(JSON.stringify(process.env));

    // Start the node express server
    const spawn = require('child_process').spawn;
if (process.platform !== 'win32'){
    webServerDirectory = path.join(__dirname, 'http');
    webServer =  spawn('/usr/local/bin/npm', ['start'], {
        cwd: webServerDirectory,
        env: env
    });
}else {
    webServer = spawn(nodePath, [webServerDirectory], {
        env: env
    });

}

    // Were we successful?
    if (!webServer) {
        log.info("couldn't start web server");
        return;
    }

    // Handle standard out data from the child process
    webServer.stdout.on('data', function(data) {
        log.info('data: ' + data);
    });

    // Triggered when a child process uses process.send() to send messages.
    webServer.on('message', function(message) {
        log.info(message);
    });

    // Handle closing of the child process
    webServer.on('close', function(code) {
        log.info('child process exited with code ' + code);
        webServer = null;

        // Only restart if killed for a reason...
        if (!shuttingDown) {
            log.info('restarting...');
            startExpress();
        }
    });

    // Handle the stream for the child process stderr
    webServer.stderr.on('data', function(data) {
        log.info('stderr: ' + data);
    });

    // Occurs when:
    // The process could not be spawned, or
    // The process could not be killed, or
    // Sending a message to the child process failed.
    webServer.on('error', function(err) {
        log.info('web server error: ' + err);
    });
}


function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 700,
        minHeight: 560,
        minWidth: 940,
        title: productName,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true
        },
        frame: !isWindows //Remove frame to hide default menu
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        return {
            action: 'allow',
            // eslint-disable-next-line max-len
            overrideBrowserWindowOptions: { // These options will be applied to the new BrowserWindow
                frame: true,
                nodeIntegration: false,
                contextIsolation: false

            }
        }
    })

    log.info(mainWindow);

    const page = mainWindow.webContents
    page.once('did-frame-finish-load', () => {
        const checkOS = isWindowsOrmacOS()
        if (checkOS && !isDev) {
            appUpdater()
        }
    })

    // Create the URL to the locally running express server
    mainWindow.loadURL(`file://${__dirname}/frame/index.html`);

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    ipcMain.on(`display-app-menu`, function(e, args) {
        if (isWindows && mainWindow) {
            menu.popup({
                window: mainWindow
            });
        }
    });

    const template = [
        {
            label: 'View',
            submenu: [
                {
                    role: 'reload'
                },
                {
                    role: 'forcereload'
                },
                {
                    role: 'toggledevtools'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'resetzoom'
                },
                {
                    role: 'zoomin'
                },
                {
                    role: 'zoomout'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'togglefullscreen'
                }
            ]
        },
        {
            role: 'window',
            submenu: [
                {
                    role: 'minimize'
                },
                {
                    role: 'close'
                }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Open Log File',
                    click: function() {
                        electron.shell.openItem(os.homedir() + '/Library/Logs/com/log.log');
                    }
                }
            ]
        }
    ];

    template.unshift({
        label: productName,
        submenu: [
            {
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                role: 'hide'
            },
            {
                role: 'hideothers'
            },
            {
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            }
        ]
    });

    const Menu = electron.Menu;
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    ipc.on('closeApp', () => {
        console.log('clickedOnCLose')
        mainWindow.close()
    })
    // Listen close event to show dialog message box
    mainWindow.on('closed', () => {
        mainWindow = null
    })
    mainWindow.on('close', (event) => {
        // Cancel the current event to prevent window from closing
        event.preventDefault()

        // options object for dialog.showMessageBox(...)
        const options = {}

        // Can be "none", "info", "error", "question" or "warning".
        options.type = 'question'

        // Array of texts for buttons.
        options.buttons = ['&Sim', '&Não', '&Cancelar']

        // Index of the button in the buttons array which will be selected by default when the message box opens.
        options.defaultId = 2

        // Title of the message box
        options.title = 'Sair do COM'

        // Content of the message box
        options.message = 'Você deseja de sair?'

        // More information of the message
        options.detail = 'Pressione sim para sair'


        // options.icon = "/path/image.png"

        // The index of the button to be used to cancel the dialog, via the Esc key
        options.cancelId = 2

        // Prevent Electron on Windows to figure out which one of the buttons are common buttons (like "Cancel" or "Yes")
        options.noLink = true

        // Normalize the keyboard access keys
        options.normalizeAccessKeys = true

        /* Syntax:
                 dialog.showMessageBox(BrowserWindow, options, callback);
                */
        dialog.showMessageBox(mainWindow, options, (res, checked) => {
        }).then((res) => {
            if (res.response === 0) {
                // Yes button pressed
                mainWindow.destroy()
            } else if (res === 1) {
                // No button pressed
            } else if (res === 2) {
                // Cancel button pressed
            }
        })
    })


    /* End of BrowserWindow close event code */

    ipc.on('minimizeApp', () => {
        console.log('clickedOnMinimize')
        mainWindow.minimize()
    })
    ipc.on('maximizeApp', () => {
        if (mainWindow.isMaximized()) {
            console.log('clickedOnRestore')
            mainWindow.restore()
        } else {
            console.log('clickedOnMaximize')
            mainWindow.maximize()
        }
    })
    ipc.on('show_notification', (event, data) => {
        console.log(data)
        new Notification({ title: data.subject, body: data.message }).show()
    })
    ipc.on('show_newOrder', (event, data) => {
        new Notification({ title: 'Novo Pedido', body: 'Um Novo Pedido Acabou de Chegar' }).show()
    })
    if(isDev) {
        app.on('browser-window-focus', function () {
            globalShortcut.register('CommandOrControl+R', () => {
                console.log('CommandOrControl+R is pressed: Shortcut Disabled')
            })
            globalShortcut.register('F5', () => {
                console.log('F5 is pressed: Shortcut Disabled')
            })
        })
    }
    app.on('browser-window-blur', function() {
        globalShortcut.unregister('CommandOrControl+R')
        globalShortcut.unregister('F5')
    })

    mainWindow.on('maximize', () => {
        console.log('ismaximized')
        mainWindow.webContents.send('isMaximized')
    })
    mainWindow.on('unmaximize', () => {
        console.log('isrestored')
        mainWindow.webContents.send('isRestored')
    })
}


app.on('ready', function() {
    shuttingDown = false;
    startExpress();
    createWindow();
});


// Called before quitting...gives us an opportunity to shutdown the child process
app.on('before-quit', function() {
    log.info('gracefully shutting down...');

    // Need this to make sure we don't kick things off again in the child process
    shuttingDown = true;

    // Kill the web process
    webServer.kill();
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

//if (process.platform === "win32") {
//	var rl = require("linebyline").createInterface({
//		input: process.stdin,
//		output: process.stdout
//	});
//
//	rl.on("SIGINT", function () {
//		process.emit("SIGINT");
//	});
//}

process.on("SIGINT", function() {
    //graceful shutdown
    log.info('shutting down...');
    process.exit();
});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});
