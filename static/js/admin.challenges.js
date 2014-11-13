/* jshint strict: true, undef: true, browser: true, jquery: true */
/* global moment */

(function () {
    'use strict';

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
                            .attr('placeholder', '10')
                            .attr('required', '');
            $li.text('Token ' + (i + 1) + ' :');
            $li.append($input);
            $tokensList.append($li);
        }
    });
}());
