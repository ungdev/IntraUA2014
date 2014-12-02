/* jshint strict: true, undef: true, browser: true, jquery: true */

(function () {
    'use strict';

    $.ajax({
        type: 'get',
        url: '/user',
        success: function (msg) {
            var colors = {
                0: ['Rouge', 'rgba(255, 0, 0, 0.6)', '#fff'],
                1: ['Bleue', 'rgba(0, 0, 255, 0.6)', '#fff']
            };

            window.isAdmin = msg.admin;

            $('#points').text('Points : ' + msg.point).css('color', '#fff');
            $('#color').css({
                fontWeight: 'bold',
                color: colors[msg.color][2],
                backgroundColor: colors[msg.color][1]
            }).text('Équipe ' + colors[msg.color][0]);
        }
    });

    $('#logout').off('click').click(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/logout',
            success: function () {
                location.reload();
            }
        });
    });

}());
