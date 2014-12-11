/* jshint strict: true, undef: true, browser: true, jquery: true */
/* global FlipClock */

(function () {
    'use strict';
    console.log('events');
    $.ajax({
        type: 'get',
        url: '/events',
        success: function (msg) {
            render(msg);
        }
    });

    // Rendering
    function render (events) {
        var $list = $('#list').empty();
        Object.keys(events).forEach(function (name) {
            var $h3 = $('<h3/>')
                .html(events[name].title + '&nbsp;&nbsp;&nbsp;')
                .append('<small/>');
            var $clock = $h3.children('small');
            var $descritpion = $('<div/>')
                                    .text(events[name].description)
                                    .addClass('description');

            // Countdown
            var eventDate = moment(events[name].date, 'YYYY-MM-DD HH:mm:ss');

            (function updateTime () {
                $clock.text(eventDate.fromNow());
                setTimeout(updateTime, 1000);
            }());

            $list.append($h3).append($descritpion);
        });
    }
    render({});
}());
