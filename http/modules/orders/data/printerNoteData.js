// Importing modules
const PDFDocument = require('pdfkit')
const fs = require('fs');
var home = require("os").homedir();
const os = require("os");
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage(os.homedir()+'/storage/data');
}


async function printOrderNote(order) {

    var PDFPath = home + '\\Documents\\COMNotesFolder\\files\\' + 'd' + Math.floor(Math.random() * 1000001) + '.pdf';
    const doc = new PDFDocument({
        size: 'A4', margins: {
            top: localStorage.getItem('PageTop'),
            bottom: localStorage.getItem('PageBottom'),
            left: localStorage.getItem('PageLeft'),
            right: localStorage.getItem('PageRight')
        }, autoFirstPage: false
    });
    let out = fs.createWriteStream(PDFPath);
    doc.pipe(out);
    for (const product of order.order.products) {
        const i = order.order.products.indexOf(product);

        if (product.custom_field_values.length > 0) {
            let m = product.custom_field_values.some(function(item) {
                return item.custom_field.name === 'Bilhete'
            });
            if (m == true) {
                product.custom_field_values.forEach(function(custom, i) {
                    if (custom.custom_field.name == 'Bilhete') {
                        doc.addPage({
                            margins: {
                                top: parseInt(localStorage.getItem('PageTop')),
                                bottom: parseInt(localStorage.getItem('PageBottom')),
                                left: parseInt(localStorage.getItem('PageLeft')),
                                right: parseInt(localStorage.getItem('PageRight'))
                            }
                        });
                        doc.image(home + '\\Documents\\COMNotesFolder\\background\\' + localStorage.getItem('ImgBackground'), 0, 0, {
                            width: doc.page.width,
                            height: doc.page.height
                        });
                        const lorem = custom.value;
                        // Adding functionality
                        doc.fontSize(localStorage.getItem('PageFont'))
                        doc.text(`${lorem}`, {
                                align: 'center'
                            }
                        );
                    }
                });
            } else {
                return await new Promise(reject => {
                    throw new Error('este pedido não possui bilhetes')
                });
            }
        } else {
            return await new Promise(reject => {
                throw new Error('este pedido não possui bilhetes')
            });
        }
    }
    doc.end();
    return await new Promise(resolve => {
        out.on("finish", function() {
            console.log('documento criado')
            resolve(PDFPath);
        });
    })
}

module.exports = { printOrderNote }