const { getPrinter } = require('../../printer/services/printer')

async function printerOrderData (order, printOption) {
    const printer = await getPrinter()
    if (printOption == 1 || printOption == 2) {
        orderInfo(printer, order)
    }
    if (printOption == 1 || printOption == 3) {
        deliveryInfo(printer, order)
    }
    printer.newLine()
    printer.newLine()
    return printer
}

function orderInfo (printer, order) {
    printer.alignCenter()
    printer.println('* * *Pedido: ' + order.order.order_number + '* * *')
    printer.println('Entrega: ' + order.order.shipping.method.name)
    printer.newLine()
    printer.println('MIRELLA DOCES')
    printer.alignCenter()
    printer.print('Data do pedido: ')
    const date = new Date(order.order.created_at)
    printer.println(date.toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
    }))
    printer.print('Data de Entrega: ')
    const deliveryDate = new Date(order.delivery_in)
    printer.println(deliveryDate.toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
    }))
    printer.println('Cliente: ' + order.customer.firstname + ' ' + order.customer.lastname)
    printer.println('Telefone:' + order.customer.areacode + order.customer.phone)
    printer.drawLine()
    printer.newLine()
    printer.alignCenter()
    printer.bold(true)
    printer.println('ITENS DO PEDIDO')
    printer.newLine()
    printer.bold(false)
    order.order.products.forEach(function (product, i) {
        printer.drawLine()
        printer.tableCustom([ // Prints table with custom settings (text, align, width, cols, bold)
            { text: (i + 1) + ' ' + product.name, align: 'LEFT', width: 0.6 },
            { text: product.item.price.BRL, align: 'RIGHT', width: 0.4, cols: 8 }
        ])
        if (product.property_values != null) {
            product.property_values.forEach(function (property, i) {
                printer.tableCustom([ // Prints table with custom settings (text, align, width, cols, bold)
                    { text: property.property.name, align: 'LEFT', width: 0.6 },
                    {
                        text: checkValue(property.value), align: 'RIGHT', width: 0.4, cols: 8
                    }
                ])
            })
        }
        printer.println('Quantidade: ' + product.quantity)
        if (product.custom_field_values.length > 0) {
            printer.newLine()
            printer.println('Campos')
            product.custom_field_values.forEach(function (custom_field, i) {
                printer.tableCustom([ // Prints table with custom settings (text, align, width, cols, bold)
                    {
                        text: custom_field.custom_field.name + ': ' + customFieldValue(custom_field),
                        align: 'LEFT',
                        width: 0.6
                    },
                    {
                        text: custom_field.price.BRL.toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL'
                        }),
                        align: 'RIGHT',
                        width: 0.4,
                        cols: 8
                    }
                ])
            })
        }
        if (product.service_options.length > 0) {
            printer.newLine()
            printer.alignCenter()
            printer.println('Serviços')
            product.service_options.forEach(function (service_option, i) {
                printer.tableCustom([
                    { text: service_option.name, align: 'LEFT', width: 0.6 },
                    { text: service_option.price_formatted, align: 'RIGHT', width: 0.4, cols: 8 }
                ])
            })
        }
        if (product.taxes.length > 0) {
            printer.newLine()
            printer.alignCenter()
            printer.println('Taxas Cobradas')
            printer.tableCustom([ // Prints table with custom settings (text, align, width, cols, bold)
                { text: 'Taxa', align: 'LEFT', width: 0.6 },
                { text: 'Porcentagem', align: 'RIGHT', width: 0.4, cols: 8 }
            ])
            product.taxes.forEach(function (taxe, i) {
                printer.tableCustom([ // Prints table with custom settings (text, align, width, cols, bold)
                    { text: taxe.name, align: 'LEFT', width: 0.6 },
                    { text: taxe.percentage, align: 'RIGHT', width: 0.4, cols: 8 }
                ])
            })
        }
        printer.newLine()
        printer.tableCustom([ // Prints table with custom settings (text, align, width, cols, bold)
            { text: 'Total de taxas', align: 'LEFT', width: 0.6 },
            {
                text: (product.total_taxes / 100).toLocaleString('pt-br', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                align: 'RIGHT',
                width: 0.4,
                cols: 8
            }
        ])
        printer.newLine()
        printer.println('Total do Produtos')
        printer.tableCustom([ // Prints table with custom settings (text, align, width, cols, bold)
            { text: 'Total', align: 'LEFT', width: 0.6 },
            {
                text: (product.total_post_taxes / 100).toLocaleString('pt-br', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                align: 'RIGHT',
                width: 0.4,
                cols: 8
            }
        ])
    })
    printer.drawLine()
    printer.println('TOTAL')
    printer.drawLine()
    printer.tableCustom([ // Prints table with custom settings (text, align, width, cols, bold)
        { text: '| itens', align: 'LEFT', width: 0.5 },
        {
            text: (order.order.total_product_post_taxes / 100).toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL'
            }) + ' |',
            align: 'RIGHT',
            width: 0.5,
            cols: 8
        }
    ])
    printer.tableCustom([ // Prints table with custom settings (text, align, width, cols, bold)
        { text: '| Entrega', align: 'LEFT', width: 0.5 },
        {
            text: (order.order.total_shipping_post_taxes / 100).toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL'
            }) + ' |',
            align: 'RIGHT',
            width: 0.5,
            cols: 8
        }
    ])
    if (order.order.discounts.length > 0) {
        order.order.discounts.forEach(function (discount, i) {
            printer.tableCustom([ // Prints table with custom settings (text, align, width, cols, bold)
                { text: '| ' + discount.discount.name, align: 'LEFT', width: 0.5 },
                {
                    text: discount.savings_formatted + ' |', align: 'RIGHT', width: 0.5, cols: 8
                }
            ])
        })
    }
    printer.tableCustom([ // Prints table with custom settings (text, align, width, cols, bold)
        { text: '| taxas totais', align: 'LEFT', width: 0.5 },
        {
            text: (order.order.total_taxes / 100).toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL'
            }) + ' |',
            align: 'RIGHT',
            width: 0.5,
            cols: 8
        }
    ])
    printer.tableCustom([ // Prints table with custom settings (text, align, width, cols, bold)
        { text: '| Total', align: 'LEFT', width: 0.5 },
        {
            text: (order.order.total_post_taxes / 100).toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL'
            }) + ' |',
            align: 'RIGHT',
            width: 0.5,
            cols: 8
        }
    ])
    printer.drawLine()
    printer.partialCut()
}

function deliveryInfo (printer, order) {
    printer.alignCenter()
    printer.println('Informações de entrega')
    printer.println('* * *Pedido: ' + order.order.order_number + '* * *')
    printer.println('Entregue Por: ' + order.order.shipping.method.name)
    printer.println('Periodo: ' + order.period.name)
    printer.println('Entregar até: ' + order.period.receive_until)
    printer.newLine()
    printer.println('MIRELLA DOCES')
    printer.print('Data do pedido: ')
    const date = new Date(order.order.created_at)
    printer.println(date.toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
    }))
    printer.print('Data de Entrega: ')
    const deliveryDate = new Date(order.delivery_in)
    printer.println(deliveryDate.toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
    }))
    printer.println('Cliente: ' + order.customer.firstname + ' ' + order.customer.lastname)
    printer.println('Telefone:' + order.customer.areacode + order.customer.phone)
    printer.println('Endereço:' + order.order.shipping_address.lines)
    printer.println('complemento:' + order.order.shipping_address.company)
    printer.println('numero:' + order.order.shipping_address.number)
    printer.println('Bairro: ' + order.order.shipping_address.district)
    printer.println('Cidade: ' + order.order.shipping_address.city)
    printer.println('Estado: ' + order.order.shipping_address.state.name)
    printer.drawLine()
}

function customFieldValue (custom_field) {
    switch (custom_field.custom_field.type) {
    case 'checkbox':
        return custom_field.value
    case 'dropdown':
        return custom_field.display_value
    case 'text':
        return custom_field.value
    case 'textarea':
        return custom_field.value
    case 'image':
        return custom_field.display_value
    case 'color':
        return custom_field.custom_field_option.name
    default:
        console.log('custom field not found: ')
    }
}

function checkValue(value) {
    if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null
    ) {
        return  value.name
    }else{
        return value
    }

}

module.exports = { printerOrderData }
