var select = $('.selectpicker')
var switcher = $('.bootstrap-switch')

var page = 1

$(function () {
    getOrders()
})

select.selectpicker()
switcher.each(function () {
    $this = $(this)
    data_on_label = $this.data('on-label') || ''
    data_off_label = $this.data('off-label') || ''

    $this.bootstrapSwitch({
        onText: data_on_label,
        offText: data_off_label,
        onSwitchChange: function (e, state) {
            $.ajax({
                url: '/saveSwitch',
                type: 'POST',
                data: {
                    switch: state
                },
                success: function (response) {
                    showNotification('top', 'right', 1, 'check', response.message)
                    getOrders()
                    if (state === false) {
                        removeScheduleProduct()
                    }
                },
                error: function (jqXHR, exception) {
                    console.log(jqXHR)
                }
            }).done(response => {
            })
        }
    })
})
select.on('change', function () {
    $.ajax({
        url: '/saveState',
        type: 'POST',
        data: {
            states: $(this).val()
        },
        success: function (response) {
            // eslint-disable-next-line no-undef
            showNotification('top', 'right', 1, 'check', response.message)

            getOrders()

        },
        error: function (jqXHR, exception) {
            console.log(jqXHR)
        }
    }).done(response => {
    })
})

var getOrders = function () {
    $.ajax({
        url: '/getOrders/' + page,
        type: 'GET',
        beforeSend: function (e) {
            $('#preloder').fadeIn()
            $('.all').remove()
        },
        success: function (response) {
            $('#preloder').fadeOut()
            createSections(response).then(() => {
                populateOrders(response)
            })
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR)
        }
    }).done(response => {
    })
}

var createSections = async function (orders) {
    $.each(orders.data, function (key, value) {
        if (!$('#orders #' + value.delivery_in).length > 0) {
            var data = new Date(value.delivery_in)
            var date = data.toLocaleDateString('pt-BR', {
                timeZone: 'UTC'
            })
            $('#orders').append('<div style="background-color: #1c1e2d" id="' + value.delivery_in + '" class="all ' + punctualityStatus(value) + ' col-lg-12 col-md-12 col-sm-12 card mt-2">\n' +
                '            <div class="card-header">\n' +
                '                <h5 class="card-category">' + date + ' </h5>\n' +
                '            </div>\n' +
                '            <div class="card-body orders">\n' +
                '\n' +
                '            </div>\n' +
                '        </div>')
        }
    })
}

function populateOrders(orders) {
    $.each(orders.data, function (key, value) {
        var element = value.delivery_in + '-' + value.order.order_number
        if ($('#orders ').find('#' + value.delivery_in + ' .orders').find('#' + element).length === 0) {
            $('#orders #' + value.delivery_in + ' .orders').append(' <div id="' + element + '" class="all card ' + punctualityStatus(value) + ' status' + value.order.order_state.id + '">\n' +
                '<div class="card-header mb-2">\n' +
                '<button class="btn btn-secondary btn-round btn-icon position-absolute mb-auto top-1 right-1" data-toggle="collapse" data-target="#body-' + value.id + '" aria-expanded="false" aria-controls="collapseExample">\n' +
                '                  <i class="tim-icons icon-minimal-down"></i>\n' +
                '</button>' +
                '<h5 class="card-category">Numero do Pedido: ' + value.order.order_number + '</h5> ' +
                '<h3 class="card-title">' + value.customer.firstname + ' ' + value.customer.lastname + '</h3>\n' +

                '<span class="badge badge-primary" style="background-color: ' + value.order.order_state.color + '">' + value.order.order_state.name + '</span>\n' +
                punctualityBadge(value) + periodBadge(value) +
                '</div>\n' +
                '<div class="card-body collapse" id="body-' + value.id + '">\n' +
                '<div class="row">\n' +
                '<div class="col-md-9">\n' +
                '<div class="tab-content">\n' +
                '<div class="tab-pane active" id="link10">\n' +
                '</p>\n' +
                '<div  id="products-' + value.id + '">\n' +
                '  <div class="card card-body">\n' +
                '<div class="table-responsive" style="overflow: hidden">\n' +
                '  <table class="table table-shopping">\n' +
                '      <thead>\n' +
                '          <tr>\n' +
                '              <th>Product</th>\n' +
                '              <th class="th-description">Qtd</th>\n' +
                '          </tr>\n' +
                '      </thead>\n' +
                '      <tbody>\n' +
                productsPopulate(value) +
                '      </tbody>\n' +
                '  </table>\n' +
                '</div>' +
                '  </div>\n' +
                '</div>' +
                '                                        <br>\n' +
                '                                    </div>\n' +
                '\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                            <div class="col-lg-3 col-md-6">\n' +
                '                                <!--\n' +
                '                                                    color-classes: "nav-pills-primary", "nav-pills-info", "nav-pills-success", "nav-pills-warning","nav-pills-danger"\n' +
                '                                                -->\n' +
                '                                <ul class="nav nav-pills nav-pills-primary nav-pills-icons flex-column">\n' +
                '<li class="nav-item"><a class="nav-link btn  btn-dark animation-on-hover print" style="cursor: pointer" data-order="' + value.order.id + '"><i class="tim-icons icon-pencil"></i> imprimir!</a></li>' +
                '                                    <li class="nav-item">\n' +

                orderButton(value) +
                '                                    </li>\n' +
                '                                </ul>\n' +
                '                            </div>\n' +
                '                        </div>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '            </div>')
        }
    })
}

function punctualityBadge(order) {
    var now = new Date()
    now.setHours(0, 0, 0, 0)
    now = now.toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
    })

    var data = new Date(order.delivery_in)
    data = data.toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
    })
    if (now > data) {
        status = 'Atrasado'
        color = 'danger'
    } else if (now < data) {
        status = 'Adiantado'
        color = 'success'
    } else {
        var status = 'Hoje'
        var color = 'primary'
    }
    return '<span class="badge badge-' + color + '">' + status + '</span>\n'
}

function punctualityStatus(order) {
    var now = new Date()
    now.setHours(0, 0, 0, 0)
    now = now.toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
    })
    var data = new Date(order.delivery_in)
    data = data.toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
    })
    if (now > data) {
        status = 'atrasado'
    } else if (now < data) {
        status = 'adiantado'
    } else {
        var status = 'hoje'
    }
    return status
}

function periodBadge(order) {
    return '<span class="badge badge-secondary">' + order.period.name + '</span>\n'
}

function productsPopulate(order) {
    var a = ''
    $.each(order.order.products, function (key, value) {
        a += '<tr>\n' +
            '              <td class="td-name">\n' +
            '<a href="#jacket" class="toMark ' + checklist('' + value.id + value.order_id + value.product_id + value.created_at + '') + '" data-cookie="' + value.id + value.order_id + value.product_id + value.created_at + '">' + value.name + '</a>\n' +
            appendProperties(value) +
            '              </td>\n' +
            '              <td>\n' +
            value.quantity +
            '              </td>\n' +
            '          </tr>\n'
    })
    return a
}

function checkValue(value) {
    if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null
    ) {
        return value.name
    } else {
        return value
    }

}

function appendProperties(product) {
    var property = ''
    $.each(product.property_values, function (key, value) {
        property += '<h5 class=" card-categorytext-capitalize  mb-0 toMark ' + checklist('' + product.id + product.order_id + value.id + value.value + '') + '" style="cursor: pointer" data-mark="false" data-cookie="' + product.id + product.order_id + value.id + value.value + '">' + value.property.name + ': ' + checkValue(value.value) + '</h5>'
    })
    if (product.custom_field_values.length !== 0) {
        property += '<br><h5 className="card-category">Campos do Produto</h5>'
        $.each(product.custom_field_values, function (key, value) {
            property += '<h5 class="card-category text-capitalize toMark  mb-0 ' + checklist('' + product.id + product.order_id + value.id + value.cart_product_id + value.custom_field_option_id + '') + '" style="cursor: pointer" data-mark="false" data-cookie="' + product.id + product.order_id + value.id + value.cart_product_id + value.custom_field_option_id + '">' + value.custom_field.name + ': ' + customFieldValue(value) + '</h5>'
        })
    }
    if (product.service_options.length !== 0) {
        property += '<br><h5 className="card-category">opções de serviço</h5>'
        $.each(product.service_options, function (key, value) {
            property += '<h5 class="card-category text-capitalize mb-0 toMark ' + checklist('' + product.id + product.order_id + value.id + value.name + '') + '" style="cursor: pointer" data-mark="false" data-cookie="' + product.id + product.order_id + value.id + value.name + '">' + value.name + '</h5>'
        })
    }
    return property
}

function customFieldValue(custom_field) {
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
        case 'additional':
            return custom_field.display_value

        default:
            console.log('custom field not found: ')
    }
}

function orderButton(order) {
    var a = ''
    $.ajax({
        url: '/buttonDefinitions',
        type: 'GET',
        async: false,
        success: function (response) {
            var allowed = eval(response).allowed_to_prepare
            var toTransport = eval(response).allowed_to_call_transport
            if (order.order.order_state.id == allowed.id) {
                a = '<a class="nav-link btn btn-primary animation-on-hover changeStatus" data-action="preparing" style="cursor: pointer" data-order="' + order.order.id + '"><i class="tim-icons icon-check-2"></i> Preparar!</a>'
            } else if (order.order.order_state.id == toTransport.id) {
                a = '<a class="nav-link btn btn-primary animation-on-hover changeStatus" data-action="transport" style="cursor: pointer" data-order="' + order.order.id + '"><i class="tim-icons icon-send"></i> Pedido Pronto!</a>'
            }
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR)
        }
    }).done(response => {
    })
    return a
}

function removeScheduleProduct() {
    $('.adiantado').slideUp('normal', function () {
        $(this).remove()
    })
}

$('#orders').on('click', '.changeStatus', function () {
    // var $data = $(this).closest('.card-body ').find('table').find('.toMark').each(function (e,value) {
    //     var $value = false
    //     if (!$(this).hasClass('com-checked')) {
    //         return false
    //     } else {
    //         $value = true
    //     }
    //     return $value
    // })
    if ($(this).closest('.card-body ').find('table').find('.toMark').not('.com-checked').length > 0 && $(this).data('action') == 'transport') {
        Swal.fire(
            'Atenção',
            'Confira todos os itens do pedido antes de concluir',
            'error'
        )
    } else {
        Swal.fire({
            title: 'Você tem certeza?',
            text: 'Você irá alterar o status do Pedido',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, Alterar'
        }).then((result) => {
            console.log(result)
            console.log(result.isConfirmed)
            if (result.value) {
                $.ajax({
                    url: '/changeStatus',
                    type: 'POST',
                    data: {order: $(this).data('order'), status: $(this).data('action')},
                    success: function (response) {
                        showNotification('top', 'right', 1, '', response.value)
                        $('.all').slideUp('normal', function () {
                            $(this).remove().promise().then(function () {
                                getOrders()
                            })
                        })
                    },
                    error: function (jqXHR, exception) {
                        console.log(jqXHR)
                        Swal.showValidationMessage(
                            `Request failed: ${jqXHR}`
                        )
                    }
                }).done(response => {
                })
            }
        })
    }
})
$('#orders').on('click', '.print', function (e) {
    e.preventDefault()
    Swal.fire({
        title: 'O que deseja Imprimir?',
        input: 'select',
        inputOptions: {
            1: 'Todas as informações',
            2: 'Informações de pedido',
            3: 'Informações de Entrega',
            4: 'imprimir bilhete'
        },
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Imprimrir',
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
            console.log(login)
            return $.ajax({
                url: '/printOrder',
                type: 'POST',
                data: {order: $(this).data('order'), printerOption: login},
                success: function (response) {
                    console.log('oba')
                },
                error: function (jqXHR, exception) {
                    Swal.showValidationMessage(
                        `Request failed: ${jqXHR}`
                    )
                }
            }).done(response => {
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        showNotification('top', 'right', 1, '', result.value.value)
    })
})
$('#orders').on('click', '.toMark', function () {
    if ($(this).hasClass('com-checked')) {
        Cookies.remove($(this).data('cookie'))
        $(this).removeClass('com-checked')
    } else {
        Cookies.set($(this).data('cookie'), true)
        $(this).addClass('com-checked')
    }
})
var checklist = function (e) {
    console.log(e)
    console.log(Cookies.get(e))
    if (Cookies.get(e)) {
        return 'com-checked'
    }
    return ''
}
