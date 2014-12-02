/* jshint strict: true, undef: true, browser: true, jquery: true */

(function () {
    'use strict';
    var _tournaments = {
        "Tournoi 1": {
            "name": "Tournoi 1",
            "teams": [
                [
                    "Team 1",
                    "Team 2"
                ],
                [
                    "Team 3",
                    "Team 4"
                ],
                [
                    "Team 5",
                    "Team 6"
                ],
                [
                    "Team 7",
                    "Team 8"
                ],
                [
                    "Team 9",
                    "Team 10"
                ],
                [
                    "Team 11",
                    "Team 12"
                ],
                [
                    "Team 13",
                    "Team 14"
                ],
                [
                    "Team 15",
                    "--"
                ]
            ],
            "results": [
                [
                    [
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            0
                        ]
                    ],
                    [
                        [
                            null,
                            null
                        ],
                        [
                            null,
                            null
                        ],
                        [
                            null,
                            null
                        ],
                        [
                            null,
                            null
                        ]
                    ],
                    [
                        [
                            null,
                            null
                        ],
                        [
                            null,
                            null
                        ]
                    ],
                    [
                        [
                            null,
                            null
                        ],
                        [
                            null,
                            null
                        ]
                    ]
                ]
            ],
            "id": "tournament1"
        }
    };

    $.ajax({
        type: 'get',
        url: '/tournaments',
        success: function (msg) {
            var tournaments = {};
            Object.keys(msg).forEach(function (tournamentId) {
                tournaments[tournamentId] = {
                    name: msg[tournamentId].title,
                    teams: JSON.parse(msg[tournamentId].data_teams),
                    results: JSON.parse(msg[tournamentId].data_results),
                    id: msg[tournamentId].id
                };
            });
            console.log(tournaments);
            render(tournaments);
        }
    });

    // Render links
    function render (tournaments) {
        var $list = $('#list').empty();
        Object.keys(tournaments).forEach(function (tournament) {
            var $h3 = $('<h3/>');
            var $a = $('<a/>')
                        .attr('href', '#')
                        .attr('data-tournament', tournament)
                        .text(tournaments[tournament].name);
            $a.appendTo($h3);
            $list.append($h3);
        });

        var $links  = $('[data-tournament]');
        var $target = $('#tournamentDetails');
        var $infos  = $('#tournamentInfos');

        $links.off('click').click(function (e) {
            e.preventDefault();

            var $self = $(this);
            var link = $self.attr('data-tournament');

            if (!link || !tournaments.hasOwnProperty(link)) {
                return;
            }

            $target.bracket({
                init: tournaments[link],
                save: $.noop,
                decorator: {
                    edit: window.bracketOnEdit,
                    render: window.bracketOnRender
                }
            });
            $('.doubleElimination').remove();

            tournaments[link].elem = $target;

            $('.tournamentSaver').remove();
            if (window.isAdmin) {
                var $button = $('<button/>')
                                .addClass('btn btn-success btn-xs tournamentSaver')
                                .attr('data-currentTournament', link)
                                .text('Envoyer les modifications')
                                .click(saveIt);
                $target.after($button);
            }

            var $join = $('<button/>')
                            .addClass('btn btn-success joinTournament')
                            .attr('data-currentTournament', link)
                            .text('Rejoindre le tournoi')
                            .click(function () {
                                joinIt.call(this, tournaments);
                            });
            $target.before($join);
        });
    }

    render(_tournaments);

    // Tournament saving
    /**
     * Save the tournament
     */
    function saveIt () {
        /* jshint validthis: true */
        var $self = $(this);
        var link = $self.attr('data-currentTournament');

        if (!tournaments.hasOwnProperty(link)) {
            return;
        }

        var $target = tournaments[link].elem;
        var tournament = $.extend(true, {}, tournaments[link]);
        delete tournament.elem;
        tournament.id = link;
        window.tournamentAlgo(tournament, $target);
        window.xxx = tournament;
        $.post({
            url: '',
            data: tournament
        });
    }

    /**
     * Join the tournament
     */
    function joinIt (tournaments) {
        var team = window.prompt('Nom de votre team');
        var link = $(this).attr('data-currentTournament');
        var tournament = $.extend(true, {}, tournaments[link]);

        var teams = tournament.teams;

        // If the last couple of teams has one item => we push
        // Else  the last couple of teams has 2 items => we append a new array
        var lastOne = teams[teams.length - 1];
        if (lastOne.length === 1 || lastOne[lastOne.length - 1] === '--') {
            console.log('append');
            teams[teams.length - 1][lastOne.length - 1] = team;
        } else {
            alert('Tournoi plein');
            return;
        }

        var teamsStr = JSON.stringify(teams);
        $.ajax({
            type: 'patch',
            url: '/tournaments/' + tournament.id + '/suscribe',
            data: teamsStr,
            success: function () {
                location.reload();
            }
        });
    }

    // Tournament edition
    /**
     * Triggered when a click is made on a label in a bracket
     * @param {element}  container The container
     * @param {Object}   data      The tournament data
     * @param {Function} doneCb    The callback
     */
    window.bracketOnEdit = function (container, data, doneCb) {
        var input = $('<input/>').attr('type', 'text');
        input.val(data);
        input.blur(function() {
            doneCb(input.val());
        });
        input.keyup(function(e) {
            if ((e.keyCode || e.which) === 13) {
                input.blur();
            }
        });
        container.html(input);
        input.focus();
    };

    /**
     * Used to save the edited data on a label in a bracket
     * @param {element}  container The container
     * @param {Object}   data      The tournament data
     */
    window.bracketOnRender = function (container, data) {
        container.html(data);
        container.trigger('contentChanged');
    };

}());
