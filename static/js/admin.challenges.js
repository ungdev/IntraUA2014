/* jshint strict: true, undef: true, browser: true, jquery: true */
/* global moment */

(function () {
    'use strict';

    $.ajax({
        type: 'get',
        url: '/challenges',
        success: function (msg) {
            render(msg);
        }
    });

    function makeid () {
        var text = '';
        var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

        var i = 5;
        while(i--) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    // Render links
    function render (challenges) {
        var $list = $('#list').empty();

        Object.keys(challenges).forEach(function (challenge) {
            var $li = $('<li/>');
            var $a = $('<a href="#">Supprimer</a>');

            $a.attr('data-tournament', challenge);
            $li.text(challenges[challenge].title + ' - ');
            $li.append($a);

            $list.append($li);
        });

        $('[data-tournament]').off('click').click(function (e) {
            e.preventDefault();

            if (!window.confirm('Supprimer le challenge ?')) {
                return;
            }

            $.ajax({
                type: 'delete',
                url: '/challenges/' + $(this).attr('data-tournament'),
                success: function () {
                    location.reload();
                }
            });
        });
    }
    render({});

    /**
     * Checks if the number is a integer
     * @param   {Number}  a The number
     * @returns {Boolean} True if the number is an integer
     */
    function isInt (a) {
        return Math.floor(a) === a;
    }

    // Tokens input generator
    var $submit     = $('#submit');
    var $nbTokens   = $('#nbTokens');
    var $tokensList = $('#tokensList');
    $nbTokens.on('keyup blur', function () {
        $tokensList.html('');
        var val = parseFloat($nbTokens.val(), 10);
        if (!val || val < 0 || !isInt(val)) {
            $nbTokens.next().text('La valeur doit être numérique positive entière');
            $submit.addClass('btn-disabled').attr('disabled', '');
            return;
        }
        $submit.removeClass('btn-disabled').removeAttr('disabled');

        $nbTokens.next().text('');

        for (var i = 0; i < val; ++i) {
            var $li = $('<li/>');
            var $input = $('<input/>')
                            .attr('type', 'number')
                            .attr('name', 'tokensPrices[]')
                            .addClass('form-control')
                            .addClass('input-sm')
                            .addClass('tokens')
                            .attr('placeholder', '10')
                            .attr('required', '');
            $li.html('Token ' + (i + 1) + ' (<span class="tokenVal">' + makeid() + '</span>) :');
            $li.append($input);
            $tokensList.append($li);
        }
    });

    $submit.off('click').click(function (e) {
        e.preventDefault();
        var $title = $('#title');
        var $descr = $('#description');
        var vals = [];
        var tokens = $('.tokens').each(function () {
            var token = $(this).parent().children('.tokenVal').text();
            var value = parseInt($(this).val(), 10);
            vals.push({
                name: token,
                value: value
            });
        });

        $.ajax({
            type: 'post',
            url: '/challenges',
            data: JSON.stringify({
                title: $title.val(),
                description: $descr.val()
            }),
            success: function (msg) {
                var id = msg.id;
                var dones = 0;
                vals.forEach(function (val) {
                    $.ajax({
                        type: 'patch',
                        url: '/challenges/' + id,
                        data: JSON.stringify(val),
                        success: function () {
                            dones++;
                            if (dones === vals.length) {
                                location.reload();
                            }
                        }
                    });
                });
            }
        });
    });
}());
