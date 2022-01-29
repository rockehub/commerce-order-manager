const ThermalPrinter = require('node-thermal-printer').printer
const PrinterTypes = require('node-thermal-printer').types
const nodePrinter = require('@thiagoelg/node-printer')
const { LocalStorage } = require('node-localstorage')
const localStorage = new LocalStorage('../../files')

async function getPrinter () {
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

async function printOut (buffer) {
    const selectedPrinter = localStorage.getItem('printer')
    if (selectedPrinter == null) {
        throw new Error('printer has not been selected')
    }
    nodePrinter.printDirect({
        data: buffer.getBuffer(),
        printer: selectedPrinter, // Printer name, if missing then will print to default printer
        type: 'RAW',
        success: function (jobID) {
            console.log('sent to printer with ID: ' + jobID)
        },
        error: function (err) {
            throw new Error(err)
        }
    })
}

module.exports = { getPrinter, printOut }
