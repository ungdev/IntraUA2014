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
        var $list = $('#list').empty();
        Object.keys(events).forEach(function (e) {
            console.log(events[e]);
            var $li = $('<li/>');
            var $a = $('<a/>')
                        .attr('href', '#')
                        .attr('data-event', events[e].id)
                        .text('Supprimer')
                        .addClass('deleteEvent');
            $li.text(events[e].title + ' - ');
            $li.append($a);
            $list.append($li);
        });

        $('.deleteEvent').off('click').click(function (e) {
            e.preventDefault();

            if (!window.confirm('Supprimer l\'événement ?')) {
                return;
            }

            $.ajax({
                type: 'delete',
                url: '/events/' + $(this).attr('data-event'),
                success: function () {
                    location.reload();
                }
            });
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
                date: moment($date.val(), 'DD/MM/YYYY HH:mm').format('YYYY/MM/DD HH:mm')
            }),
            success: function () {
                location.reload();
            }
        });
    });
}());
