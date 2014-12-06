/* jshint strict: true, undef: true, browser: true, jquery: true */
/* jshint devel: true */

(function () {
    'use strict';

    function generator (baseTournament, $target) {
        $('.doubleElimination').remove();
        var tournamentElem5to8 = false;
        var tournamentElem9to16 = false;
        var tournamentElem13to16 = false;

        // Get all teams
        var teamList = [];
        baseTournament.teams.forEach(function (teamArr) {
            teamList = $.merge(teamList, teamArr);
        });
        teamList = $.unique(teamList);

        if (teamList.length <= 4) {
            return;
        }

        var isSixteenTournament = teamList.length === 16;
        var isHeightTournament = teamList.length === 8;

        // Get firsts four
        var firstsFours = [
            getFirstX(1),
            getFirstX(2),
            getFirstX(3),
            getFirstX(4)
        ];

        var $rounds = $target.children().first().find('.round');
        if (isHeightTournament) {
            // First round played
            if ($rounds.eq(0).find('.win').length === 4) {
                if ($('#Sub-' + baseTournament.id + '-5to8').length === 0) {
                    var $loosers8_5to8 = $rounds.eq(0).find('.lose > .label.editable');
                    var loosers8_5to8 = $loosers8_5to8.map(function () {
                        return $(this).text();
                    });

                    tournamentElem5to8 = createSub4Tournament('Sub-' + baseTournament.id + '-5to8', loosers8_5to8, true);
                }
            }
        }

        if (isSixteenTournament) {
            // First round played
            if ($rounds.eq(0).find('.win').length === 8) {
                if ($('#Sub-' + baseTournament.id + '-9to16').length === 0) {
                    var $loosers16_9to16 = $rounds.eq(0).find('.lose > .label.editable');
                    var loosers16_9to16 = $loosers16_9to16.map(function () {
                        return $(this).text();
                    });

                    tournamentElem9to16 = createSub8Tournament('Sub-' + baseTournament.id + '-9to16', loosers16_9to16);
                }
            }

            // Second round played
            if ($rounds.eq(1).find('.win').length === 4) {
                if ($('#Sub-' + baseTournament.id + '-5to8').length === 0) {
                    var $loosers16_5to8 = $rounds.eq(1).find('.lose > .label.editable');
                    var loosers16_5to8 = $loosers16_5to8.map(function () {
                        return $(this).text();
                    });

                    tournamentElem5to8 = createSub4Tournament('Sub-' + baseTournament.id + '-5to8', loosers16_5to8);
                }

                if ($('#Sub-' + baseTournament.id + '-13to16').length === 0) {
                    var $rounds9to16 = $('#Sub-' + baseTournament.id + '-9to16').children().first().find('.round');
                    var $loosers16_13to16 = $rounds9to16.eq(0).find('.lose > .label.editable');
                    var loosers16_13to16 = $loosers16_13to16.map(function () {
                        return $(this).text();
                    });

                    if (loosers16_13to16.length !== 0) {
                        tournamentElem13to16 = createSub4Tournament('Sub-' + baseTournament.id + '-13to16', loosers16_13to16, 8);
                    }
                }
            }
        }

        tournamentElem5to8   = tournamentElem5to8   || $('#Sub-' + baseTournament.id + '-5to8');
        tournamentElem9to16  = tournamentElem9to16  || $('#Sub-' + baseTournament.id + '-9to16');
        tournamentElem13to16 = tournamentElem13to16 || $('#Sub-' + baseTournament.id + '-13to16');

        tournamentElem5to8.insertAfter($target.children().last());
        tournamentElem9to16.insertAfter($target.children().last());
        tournamentElem13to16.insertAfter($target.children().last());
    }

    /**
     * Return the firsts four team name
     * @param   {Number} rank The first ranked teams
     * @returns {String} The team name
     */
    function getFirstX (rank) {
        var assoRankText = {
            1: '1st',
            2: '2nd',
            3: '3rd',
            4: '4th'
        };

        if (!assoRankText.hasOwnProperty(rank)) {
            return;
        }

        var newRank = assoRankText[rank];
        var team = $('.bubble:contains("' + newRank + '")')
            .prev()
            .prev()
            .text();
        return team;
    }

    /**
     * Creates a sub-tournament for 4 persons (usually 5-9 and 12-16)
     * @param {String}  name          The tournament name
     * @param {Array}   list          The team list
     * @param {Number}  startRank     Starting rank (used for 13th to 16th)
     */
    function createSub4Tournament (name, list, startRank, fromEight) {
        var tournament = genBracketObjFromList(name, list);
        var shift = (fromEight) ? 'shiftTournament-1' : 'shiftTournament-2';
        var $div = $('<div/>').addClass(shift).attr('id', name);
        console.log(tournament);
        $div.bracket({
            init: tournament,
            save: $.noop,
            decorator: {
                edit: window.bracketOnEdit,
                render: function () {
                    window.bracketOnRender.apply(this, arguments);
                    contentChanged();
                }
            }
        });
        $div.find('.tools').remove();

        /**
         * Triggered when the tournament has been edited
         */
        function contentChanged () {
            setTimeout(function () {
                var $updatedDiv = $('.' + $div.attr('class')).first();
                var $bubbles = $div.find('.bubble');
                $bubbles.attr('class', 'bubble fourth').each(function () {
                    var $self = $(this);
                    var text = $self.text();
                    var place = 0;
                    if (startRank) {
                        place = parseInt(text.slice(0, 2), 10);
                    } else {
                        place = parseInt(text.slice(0, 1), 10);
                    }
                    if (place < 5) {
                        if (startRank) {
                            place += startRank;
                        }
                        $self.text(place + 4 + 'th');
                    }
                });
            }, 400);
        }

        // Fix wrong placement
        setTimeout(function () {
            var $firstInput = $div.find('.score.editable').first();
            $firstInput.click();
            var e = jQuery.Event('keydown');
            e.which = 13;
            e.keyCode = 13;
            $firstInput.children().trigger(e);
            $firstInput.children().blur();
        }, 200);

        return $div;
    }

    /**
     * Creates a sub-tournament for 8 persons (usually 9-16)
     * @param {String}  name    The tournament name
     * @param {Array}   list    The team list
     */
    function createSub8Tournament (name, list) {
        var tournament = genBracketObjFromList(name, list);
        var $div = $('<div/>').addClass('shiftTournament-1').attr('id', name);
        $div.bracket({
            init: tournament,
            save: $.noop,
            decorator: {
                edit: window.bracketOnEdit,
                render: function () {
                    window.bracketOnRender.apply(this, arguments);
                    contentChanged();
                }
            }
        });
        $div.find('.tools').remove();

        /**
         * Triggered when the tournament has been edited
         */
        function contentChanged () {
            setTimeout(function () {
                var $updatedDiv = $('.' + $div.attr('class')).first();
                var $bubbles = $div.find('.bubble');
                $bubbles.attr('class', 'bubble fourth').each(function () {
                    var $self = $(this);
                    var text = $self.text();
                    var place = parseInt(text.slice(0, 2), 10);
                    if (place < 5) {
                        $self.text(place + 8 + 'th');
                    }
                });
            }, 400);
        }

        // Fix wrong placement
        setTimeout(function () {
            var $firstInput = $div.find('.score.editable').first();
            $firstInput.click();
            var e = jQuery.Event('keydown');
            e.which = 13;
            e.keyCode = 13;
            $firstInput.children().trigger(e);
            $firstInput.children().blur();
        }, 200);

        return $div;
    }

    /**
     * Generates a bracket object from a team list
     * @param   {String} name The tournament name
     * @param   {Array}  list The team list
     * @returns {Object} The jQuery-Bracket object
     */
    function genBracketObjFromList (name, list) {
        var tournament = {};
        tournament.name = name;
        tournament.teams = [];
        for (var i = 1; i <= list.length; i += 2) {
            tournament.teams.push([list[i - 1], list[i]]);
        }

        if (list.length === 2) {
            tournament.results = [
                [
                    [
                        [null, null]
                    ]
                ]
            ];
        } else if (list.length === 4) {
            tournament.results = [
                [
                    [
                        [null, null],
                        [null, null]
                    ],
                    [
                        [null, null],
                        [null, null]
                    ]
                ]
            ];
        } else if (list.length === 8) {
            tournament.results  = [
                [
                    [
                        [null, null],
                        [null, null],
                        [null, null],
                        [null, null]
                    ],
                    [
                        [null, null],
                        [null, null]
                    ],
                    [
                        [null, null],
                        [null, null]
                    ]
                ]
            ];
        } else if (list.length === 16) {
            tournament.results = [
                [
                    [
                        [null, null],
                        [null, null],
                        [null, null],
                        [null, null],
                        [null, null],
                        [null, null],
                        [null, null],
                        [null, null]
                    ],
                    [
                        [null, null],
                        [null, null],
                        [null, null],
                        [null, null]
                    ],
                    [
                        [null, null],
                        [null, null]
                    ],
                    [
                        [null, null],
                        [null, null]
                    ]
                ]
            ];
        }

        return tournament;
    }

    window.tournamentAlgo = generator;
    window.genBracketObjFromList = genBracketObjFromList;
}());
