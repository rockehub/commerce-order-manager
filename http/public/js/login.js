const $form = $('#login');

$form.on('submit', (e) => {
    e.preventDefault()
    $.ajax({
        url: '/login',
        type: 'POST',
        data: $form.serialize(),
        success: function (response) {
            window.location.replace("/");
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR)
            $.each(jqXHR.responseJSON.errors, function (i, name) {
                if (name.param == undefined) {
                    name.param = '';
                }
                showNotification('top', 'right', 4, 'tim-icons icon-bell-55', name.param + ' ' + name.msg)
            });

        }
    }).done(response => {
    })
})

type = ['', 'info', 'success', 'warning', 'danger'];

function showNotification(from, align, color, icon, message) {
    $.notify({
        icon: icon,
        message: message

    }, {
        type: type[color],
        timer: 8000,
        placement: {
            from: from,
            align: align
        }
    });
}

$(function () {
    $.ajax({
        url: '/authenticate',
        type: 'GET',
        success: function (response) {
            if (response.value === true) {
                window.location.replace("/");
            }
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR)
        }
    }).done(response => {
    })
})