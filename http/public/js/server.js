// Internal Dependencies
let {ipcRenderer} = require("electron");
const spawn = require("child_process").spawn;
const request = require("request");
const _ = require("lodash");
const maxResBtn = document.getElementById('maxResBtn');
const mySideBar = document.getElementById('mySidebar')
// Global Path
const expressAppUrl = "http://127.0.0.1:3326";
const nodePath = "./node_modules/node/bin/node";
const expressPath = "./express-app/bin/www";
var isLeftMenuActive = false;

// Elements ID 
const serverLog = document.getElementById("serverLog");
const expressApp = document.getElementById("expressApp");
const loading = document.getElementById("loading");


// For electron-packager change cwd in spawn to app.getAppPath() and
// uncomment the app require below
//const app = require('electron').remote.app,
const node = spawn(nodePath, [expressPath], {
    cwd: process.cwd(),
});

closeBtn.addEventListener('click', () => {
    ipcRenderer.send('closeApp')
})
minimizeBtn.addEventListener('click', () => {
    ipcRenderer.send('minimizeApp')
})
maxResBtn.addEventListener('click', () => {
    ipcRenderer.send('maximizeApp')
})

function changeMaxBtn(isMaximizedApp) {
    console.log('chega Aqui')
    if (isMaximizedApp) {
        maxResBtn.title = 'Restore'
        let icon = maxResBtn.firstElementChild
        icon.classList.remove('fa-window-maximize')
        icon.classList.add('fa-window-restore')
    } else {
        maxResBtn.title = 'Maximize'
        let icon = maxResBtn.firstElementChild
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

/**
 * ==============================
 *      GLOBAL EVENTS
 * ==============================
 */


ipcRenderer.on("stop-server", (event, data) => {
    process.on('SIGTERM', function onSigterm() {
        node.close(function onServerClosed(err) {
            if (err) {
                console.error(err)
                process.exit(1)
            }
            closeMyResources(function onResourcesClosed(err) {
                process.exit()
            })
        })
    });
});

ipcRenderer.on("show-server-log", (event, data) => {
    if (serverLog.style.display == "none") {
        serverLog.style.display = "block";
        expressApp.classList.add("expressAppHide");
    } else {
        expressApp.classList.remove("expressAppHide");
        serverLog.style.display = "none";
    }
});

/* XXXXXXXXXX END OF GLOBAL EVENTS XXXXXXXXXX */


/**
 * ========================================
 *              FUNCTIONS
 * ========================================
 */

function strip(s) {
    // regex from: http://stackoverflow.com/a/29497680/170217
    // REGEX to Remove all ANSI colors/styles from strings
    return s.replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        ""
    );
}

function redirectOutput(x) {
    let lineBuffer = "";
    x.on("data", function (data) {
        lineBuffer += data.toString();
        let lines = lineBuffer.split("\n");
        _.forEach(lines, (l) => {
            if (l !== "") {
                serverLog.append(strip(l) + "<br/>");
            }
        });
        lineBuffer = lines[lines.length - 1];
    });
}

/* XXXXXXXXXX END OF FUNCTIONS XXXXXXXXXXX */


redirectOutput(node.stdout);

redirectOutput(node.stderr);

let checkAuthentication = () => {
    request(expressAppUrl + '/server', (error, response, body) => {
        // expressApp.setAttribute("src", expressAppUrl + '/');
        fetch(expressAppUrl)
            .then(data => {
                return data.text()
            })
            .then( data => {
                document.getElementById("expressApp").innerHTML = data;
            })
        expressApp.style.display = "block";
        loading.style.display = "none";
        clearInterval(checkServerRunning);
    })
}


let checkServerRunning = setInterval(() => {
    checkAuthentication()


}, 1000);
