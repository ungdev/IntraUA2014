/* jshint strict: true, undef: true, browser: true, jquery: true */
/* global moment */

(function () {
    'use strict';
    $('#newMemberForm').off('submit').submit(function (e) {
        e.preventDefault();
        $('p').remove();
	var paragraph = $('<p>');
        $.ajax({
            type: 'post',
            url: '/user',
            data: JSON.stringify({
                username: $("#username").val(),
                plainPassword: $("#plainPassword").val(),
                color: $("input:radio[name=color]:checked").val(),
                admin: $("#admin").val()
            }),
            success: function () {
		paragraph.text('Cet utilisateur a été crée');
		paragraph.attr('class', 'alert alert-success');
		$("h1").after(paragraph);
            },
            error: function () {
		paragraph.text("Cet utilisateur n'a pas été créee");
		paragraph.attr('class', 'alert alert-danger');
		$("h1").after(paragraph);
            }
        });
    });
}());
