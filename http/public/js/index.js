$('.dinamicLink').on('click', function (e) {
    e.preventDefault();
    console.log($(this).data('src'))
    $('#navbar-title').text($(this).data('text'))
    $("#content").load($(this).data('src'), function () {
       setTimeout(function () {
           $('#preloder').fadeOut()
       },500)
    });
})
$(function () {
    $("#content").load('/notify', function () {
        setTimeout(function () {
            $('#preloder').fadeOut()
        },500)
    });
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

$('#logout').on('click', function () {
    $.ajax({
        url: '/logout',
        type: 'GET',
        success: function (response) {
            console.log(response)
            if (response.value === true) {
                window.location.replace("/login");
            }
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR)
        }
    }).done(response => {
    })
})

