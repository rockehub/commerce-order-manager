var select = $('.selectpicker');
select.selectpicker();
select.on('change', function () {
    $.ajax({
        url: '/saveWarehouse',
        type: 'POST',
        data: {warehouse: $(this).val()},
        success: function (response) {
            showNotification('top', 'right', 1, 'check', 'saved with success')
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR)
        }
    }).done(response => {
    })
})

var selectPrinter = $('.selectpickerprinter');
selectPrinter.selectpicker();
selectPrinter.on('change', function () {
    $.ajax({
        url: '/savePrinter',
        type: 'POST',
        data: {printer: $(this).val()},
        success: function (response) {
            showNotification('top', 'right', 1, 'check', 'saved with success')
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR)
        }
    }).done(response => {
    })
})


var typingTimer;                //timer identifier
var doneTypingInterval = 1000;  //time in ms, 5 second for example
var $input = $('#bufferSize');

//on keyup, start the countdown
$input.on('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

//on keydown, clear the countdown
$input.on('keydown', function () {
    clearTimeout(typingTimer);
});

//user is "finished typing," do something
function doneTyping () {
    $.ajax({
        url: '/saveBuffer',
        type: 'POST',
        data: {buffer: $input.val()},
        success: function (response) {
            showNotification('top', 'right', 1, 'check', 'saved with success')
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR)
        }
    }).done(response => {
    })
}
