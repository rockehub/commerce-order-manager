const ThermalPrinter = require('node-thermal-printer').printer
const PrinterTypes = require('node-thermal-printer').types
const nodePrinter = require('@thiagoelg/node-printer')
const os = require("os");
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage(os.homedir()+'/storage/data');
}
const fs = require('fs');
const { print } = require("pdf-to-printer");

async function getPrinter() {
    const printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        width: localStorage.getItem('bufferSize'), // Printer type: 'star' or 'epson'
        characterSet: 'SLOVENIA', // Printer character set - default: SLOVENIA
        removeSpecialCharacters: true, // Removes special characters - default: false
        lineCharacter: '-', // Set character for lines - default: "-"
        options: { // Additional options
            timeout: 5000 // Connection timeout (ms) [applicable only for network printers] - default: 3000
        }
    })
    return printer
}

async function printOut(buffer) {
    const selectedPrinter = localStorage.getItem('printer')
    if (selectedPrinter == null) {
        throw new Error('printer has not been selected')
    }
    nodePrinter.printDirect({
        data: buffer.getBuffer(),
        printer: selectedPrinter, // Printer name, if missing then will print to default printer
        type: 'RAW',
        success: function(jobID) {
            console.log('sent to printer with ID: ' + jobID)
        },
        error: function(err) {
            throw new Error(err)
        }
    })
}


async function printNoteOut(buffer) {
    const selectedPrinter = localStorage.getItem('ticketPrinter')
    let options = {
        data: fs.readFileSync(buffer),
        outputFormat: process.argv[2] || 'EMF' // could be a item from pdfium.getSupportedOutputFormats();
    };
    if (selectedPrinter == null) {
        throw new Error('printer has not been selected')
    } else {
        if (!fs.existsSync(buffer)) {
            throw new Error('o Arquivo não existe')
        } else {
            const options = {
                printer: selectedPrinter,
            };

            print(buffer, options).then(console.log);
        }
    }

}

module.exports = { getPrinter, printOut, printNoteOut }
