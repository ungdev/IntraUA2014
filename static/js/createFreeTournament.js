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

    $submit.off('click').click(function (e) {
        e.preventDefault();
        var name = $('#title').val();
        var desc = $('#description').val();
        var maxp = $('#maxplayers').val();
        var inTeam = $('#inTeam').val();
        var nbTeams = parseInt($('#nbTeams').text(), 10);

        if (!name || !desc || !maxp || !inTeam) {
            return;
        }

        var list = [];
        for (var i = 1; i <= nbTeams; ++i) {
            list.push('Equipe ' + i.toString());
        }

        var tournament = genBracketObjFromList(name, list);

        $.ajax({
            type: 'post',
            url: '/tournaments',
            data: JSON.stringify({
                title: name,
                description: desc,
                capacity: maxp,
                teamSize: inTeam,
                data_teams: JSON.stringify(tournament.teams),
                data_results: JSON.stringify(tournament.results)
            }),
            success: function () {
                location.hash = '!/tournaments.html';
            }
        });
    });

    $inTeam.add($maxplayers).off('keyup').keyup(function () {
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
                    var ratio = maxplayers / inTeam;
                    if (ratio === 2 || ratio === 4 || ratio === 8 || ratio === 16) {
                        $span.text(maxplayers / inTeam);
                    } else {
                        $submit
                            .attr('disabled', '')
                            .removeClass('btn-disabled');
                        $span.text('Le nombre d\'équipes doit être une puissance de 2 (max: 16)');
                    }
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
