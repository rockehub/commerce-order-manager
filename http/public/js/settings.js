var select = $('.selectpicker');
select.selectpicker();
select.on('change', function() {
    $.ajax({
        url: '/saveWarehouse',
        type: 'POST',
        data: { warehouse: $(this).val() },
        success: function(response) {
            showNotification('top', 'right', 1, 'check', 'saved with success')
        },
        error: function(jqXHR, exception) {
            console.log(jqXHR)
        }
    }).done(response => {
    })
})

var selectPrinter = $('.selectpickerprinter');
selectPrinter.selectpicker();
selectPrinter.on('change', function() {
    $.ajax({
        url: '/savePrinter',
        type: 'POST',
        data: { printer: $(this).val() },
        success: function(response) {
            showNotification('top', 'right', 1, 'check', 'saved with success')
        },
        error: function(jqXHR, exception) {
            console.log(jqXHR)
        }
    }).done(response => {
    })
})
selectpickerticketprinter = $('.selectpickerticketprinter')
selectpickerticketprinter.selectpicker();
selectpickerticketprinter.on('change', function() {
    $.ajax({
        url: '/saveTicketPrinter',
        type: 'POST',
        data: { printer: $(this).val() },
        success: function(response) {
            showNotification('top', 'right', 1, 'check', 'saved with success')
        },
        error: function(jqXHR, exception) {
            console.log(jqXHR)
        }
    }).done(response => {
    })
})

var typingTimer;                //timer identifier
var doneTypingInterval = 1000;  //time in ms, 5 second for example
var $input = $('#bufferSize');

//on keyup, start the countdown
$input.on('keyup', function() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

//on keydown, clear the countdown
$input.on('keydown', function() {
    clearTimeout(typingTimer);
});

//user is "finished typing," do something
function doneTyping() {
    $.ajax({
        url: '/saveBuffer',
        type: 'POST',
        data: { buffer: $input.val() },
        success: function(response) {
            showNotification('top', 'right', 1, 'check', 'saved with success')
        },
        error: function(jqXHR, exception) {
            console.log(jqXHR)
        }
    }).done(response => {
    })
}

select = $('#pagesize');
select.selectpicker()
var changePageSize = function() {
    var pagewidth = select.find(':selected').data('width')
    var pageheight = select.find(':selected').data('height')
    $('#page').width(pagewidth / 3)
    $('#page').height(pageheight / 3)
}

select.on('change', function() {
    var pagewidth = select.find(':selected').data('width')
    var pageheight = select.find(':selected').data('height')
    $.ajax({
        url: '/savePage',
        type: 'POST',
        data: { value: select.val(), width: pagewidth, height: pageheight },
        success: function(response) {
            showNotification('top', 'right', 1, 'check', 'saved with success')
            changePageSize()
        },
        error: function(jqXHR, exception) {
            console.log(jqXHR)
        }
    }).done(response => {
    })
})


$(function() {
    changePageSize()
    var $page = $('#page');
    var $text = $('#text')
    var top = $('#top').val()
    var left = $('#left').val()
    var right = $('#right').val()
    var bottom = $('#bottom').val()
    var font = $('#font').val()
    var imgsrc = $('#bgimage').attr('src');
    $page.animate({ 'padding-top': top / 3 }, 'fast');
    $page.animate({ 'padding-left': left / 3 }, 'fast');
    $page.animate({ 'padding-right': right / 3 }, 'fast');
    $page.animate({ 'padding-bottom': bottom / 3 }, 'fast');
    $text.animate({ 'font-size': font / 3 + 'pt' }, 'fast')

    $page.css({
        'background-image': 'url("' + imgsrc + '")',
        'background-size': 'contain'
    });
})

$('.margin').on('focusout', function() {
    var $page = $('#page');
    var $text = $('#text')
    var top = $('#top').val()
    var left = $('#left').val()
    var right = $('#right').val()
    var bottom = $('#bottom').val()
    var font = $('#font').val()

    $.ajax({
        url: '/saveMargin',
        type: 'POST',
        data: { top: top, left: left, right: right, bottom: bottom, font: font },
        success: function(response) {
            showNotification('top', 'right', 1, 'check', 'saved with success')
            $page.animate({ 'padding-top': top / 3 }, 'slow');
            $page.animate({ 'padding-left': left / 3 }, 'slow');
            $page.animate({ 'padding-right': right / 3 }, 'slow');
            $page.animate({ 'padding-bottom': bottom / 3 }, 'slow');
            $text.animate({ 'font-size': font / 3 + 'pt' }, 'fast')
        },
        error: function(jqXHR, exception) {
            console.log(jqXHR)
        }
    }).done(response => {
    })

})

$("#uploadimg").submit(function(e) {
    e.preventDefault()
    var page = $('#page')
    var imgsrc = $('#bgimage').attr('src');
    var formData = new FormData(this);
    $.ajax({
        url: '/upload-back',
        type: 'POST',
        data: formData,
        success: function(data) {
            page.css({
                'background-image': 'url("' + imgsrc + '")',
                'background-size': 'contain'
            });
        },
        cache: false,
        contentType: false,
        processData: false,
        xhr: function() { // Custom XMLHttpRequest
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) { // Avalia se tem suporte a propriedade upload
                myXhr.upload.addEventListener('progress', function() {

                }, false);
            }
            return myXhr;
        }
    });
});

