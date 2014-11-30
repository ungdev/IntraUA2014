/* jshint strict: true, undef: true, browser: true, jquery: true */
/* global moment */

(function () {
    'use strict';
    // Date
    $('.date').datetimepicker({
        defaultDate: moment('12/12/2014', 'DD/MM/YYYY'),
        language: 'fr',
        maxDate: moment('14/12/2014', 'DD/MM/YYYY'),
        minDate: moment('12/12/2014', 'DD/MM/YYYY'),
        minuteStepping: 5,
        useSeconds: false,
        useStrict: true
    });

    $.ajax({
        type: 'get',
        url: '/events',
        success: function (msg) {
            render(msg);
        }
    });

    function render (events) {
        var $list = $('#list');
        Object.keys(events).forEach(function (event) {
            var $li = $('<li/>');
            var $a = $('<a/>').attr('href').text('Supprimer');
            $li.text(events[event].name);
            $li.append($a);
            $list.append($li);
        });
    }
    render({});

    var $title = $('#title');
    var $date = $('#date');
    var $desc = $('#description');
    $('#eventForm').off('submit').submit(function (e) {
        e.preventDefault();

        $.ajax({
            type: 'post',
            url: '/events',
            data: JSON.stringify({
                title: $title.val(),
                description: $desc.val(),
                date: parseInt(moment($date.val(), 'DD/MM/YYYY HH:mm').format('YYYY/MM/DD HH:mm'), 10)
            }),
            success: function (msg) {
                console.log(msg);
            },
            error: function (msg) {
                console.log(msg);
            }
        });
    });
}());
