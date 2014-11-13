/* jshint strict: true, undef: true, browser: true, jquery: true */

(function () {
    'use strict';
    var $nbTeams    = $('#nbTeams');
    var $inTeam     = $('#inTeam');
    var $maxplayers = $('#maxplayers');
    var $submit     = $('#submit');

    /**
     * Checks if the number is a integer
     * @param   {Number}  a The number
     * @returns {Boolean} True if the number is an integer
     */
    function isInt (a) {
        return Math.floor(a) === a;
    }

    $inTeam.add($maxplayers).on('keyup', function () {
        var maxplayers = parseFloat($maxplayers.val(), 10);
        var inTeam = parseFloat($inTeam.val(), 10);
        var $span = $('<span/>')
                        .addClass('text-danger');

        if (maxplayers && inTeam) {
            if (maxplayers !== 0 && inTeam !== 0) {
                if (isInt(maxplayers / inTeam)) {
                    $span.removeClass('text-danger');
                    $span.addClass('text-success');
                    $submit
                        .removeAttr('disabled')
                        .removeClass('btn-disabled');
                    $span.text(maxplayers / inTeam);
                } else {
                    $submit
                        .attr('disabled', '')
                        .removeClass('btn-disabled');
                    $span.text('Le nombre d\'équipes doivent être positif.');
                }
            } else {
                $submit
                    .attr('disabled', '')
                    .removeClass('btn-disabled');
                $span.text('Les valeurs ne doivent pas être nulles.');
            }
        } else {
            $submit
                .attr('disabled', '')
                .removeClass('btn-disabled');
            $span.text('Entrez des valeurs.');
        }
        $nbTeams.html($span);
    });
}());
