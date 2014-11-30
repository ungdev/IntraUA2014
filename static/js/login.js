/* jshint strict: true, undef: true, browser: true, jquery: true */

(function () {
    'use strict';

    var $loginForm = $('#loginForm');
    var $login = $('#login');
    var $pwd = $('#password');
    var $err = $('#err');

    $loginForm.off('submit').submit(function (e) {
        e.preventDefault();

        var uname = $login.val();
        var pwd = $pwd.val();
        $.ajax({
            type: 'post',
            url: '/login',
            data: JSON.stringify({
                username: uname,
                password: pwd
            }),
            success: function () {
                location.href = 'index.html';
            },
            error: function (msg) {
                $err.slideDown().delay(5000).slideUp();
            }
        });
    });

}());
