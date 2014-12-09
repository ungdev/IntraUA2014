/* jshint strict: true, undef: true, browser: true, jquery: true */
/* jshint devel: true */

(function () {
    'use strict';

    function createLine (team, score) {
        var $tr = $('<tr/>');
        var $td1 = $('<td/>').text(team).on('click', function () {
            var newValue = window.prompt('Entrez le nouveau nom d\'équipe ("delete" : supprime la ligne) :');
            if (newValue) {
                if (newValue === 'delete') {
                    $(this).parent().remove();
                    return;
                }
                $(this).text(newValue);
            }
        });
        var $td2 = $('<td/>').text(score).on('click', function () {
            var newValue = window.prompt('Entrez le nouveau nombre de points :');
            if (newValue) {
                $(this).text(newValue);
            }
        });
        $tr.append($td1).append($td2);
        return $tr;
    }

    function poolify (baseData) {
        var data = JSON.parse(baseData);
        var $tables = $('<div/>').addClass('row').css('marginTop', '10px');

        data.forEach(function (v, k) {
            var $div = $('<div/>').addClass('col-sm-3');
            var $table = $('<table/>').addClass('table table-striped table-bordered table-hover table-condensed table-responsive pool');
            var $thead = $('<thead/>').appendTo($table);
            var $tbody = $('<tbody/>').appendTo($table);

            var $trH = $('<tr/>');
            var $th1 = $('<th/>').html('Équipe <small>Click to add</small>').attr('title', 'Cliquez pour ajouter une team').css('cursor', 'pointer').on('click', function () {
                var newTeam = window.prompt('Entrez le nom de la nouvelle équipe :');

                if (!newTeam) {
                    return;
                }

                $tbody.append(createLine(newTeam, '0'));
            });
            var $th2 = $('<th/>').text('Points');

            $trH.append($th1).append($th2);
            $thead.append($trH);

            v.forEach(function (team) {
                $tbody.append(createLine(team[0], team[1]));
            });

            $div.append($table);
            $tables.append($div);
        });

        return $tables;
    }

    function unpoolify ($tables) {
        var data = [];
        $tables.children().each(function () {
            console.log(this);
            var newArr = [];

            var teams = $(this).find('tbody td:first-child').map(function () {
                return $(this).text();
            });

            var scores = $(this).find('tbody td:last-child').map(function () {
                return $(this).text();
            });

            teams.each(function (i) {
                newArr.push([teams[i], scores[i]]);
            });

            data.push(newArr);
        });

        return JSON.stringify(data);
    }

    window.poolify = poolify;
    window.unpoolify = unpoolify;
}());
