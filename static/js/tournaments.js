/* jshint strict: true, undef: true, browser: true, jquery: true */

(function () {
    'use strict';

    var allTournaments;

    $.ajax({
        type: 'get',
        url: '/tournaments',
        success: function (msg) {
            allTournaments = msg;
            var tournaments = {};
            Object.keys(msg).forEach(function (tournamentId) {
                tournaments[tournamentId] = {
                    name: msg[tournamentId].title,
                    teams: JSON.parse(msg[tournamentId].data_teams),
                    results: JSON.parse(msg[tournamentId].data_results),
                    id: msg[tournamentId].id
                };

                // Restore sub tournaments
                if (msg[tournamentId].data_resultsSub5to8) {
                    tournaments['Sub-' + msg[tournamentId].id + '-5to8'] = {
                        name: 'Sub-' + msg[tournamentId].id + '-5to8',
                        teams: JSON.parse(msg[tournamentId].data_teamsSub5to8),
                        results: JSON.parse(msg[tournamentId].data_resultsSub5to8),
                        id: 'Sub-' + msg[tournamentId].id + '-5to8'
                    };
                }

                if (msg[tournamentId].data_resultsSub9to16) {
                    tournaments['Sub-' + msg[tournamentId].id + '-9to16'] = {
                        name: 'Sub-' + msg[tournamentId].id + '-9to16',
                        teams: JSON.parse(msg[tournamentId].data_teamsSub9to16),
                        results: JSON.parse(msg[tournamentId].data_resultsSub9to16),
                        id: 'Sub-' + msg[tournamentId].id + '-9to16'
                    };
                }

                if (msg[tournamentId].data_resultsSub13to16) {
                    tournaments['Sub-' + msg[tournamentId].id + '-13to16'] = {
                        name: 'Sub-' + msg[tournamentId].id + '-13to16',
                        teams: JSON.parse(msg[tournamentId].data_teamsSub13to16),
                        results: JSON.parse(msg[tournamentId].data_resultsSub13to16),
                        id: 'Sub-' + msg[tournamentId].id + '-13to16'
                    };
                }
            });
            render(tournaments);
        }
    });

    // Render links
    function render (tournaments) {
        var $list = $('#list').empty();
        Object.keys(tournaments).forEach(function (tournament) {
            if (tournament.indexOf('Sub-') === 0) {
                return;
            }

            var $h3 = $('<h3/>');
            var $a = $('<a/>')
                        .attr('href', '#')
                        .attr('data-tournament', tournament)
                        .text(tournaments[tournament].name);
            $a.appendTo($h3);
            $h3.append('<small>&nbsp;' + allTournaments[tournament].description + '</small>');
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

            tournaments[link].elem = $target;

            // Add sub tournaments
            var has5to8 = tournaments.hasOwnProperty('Sub-' + link + '-5to8');
            var has9to16 = tournaments.hasOwnProperty('Sub-' + link + '-9to16');
            var has13to16 = tournaments.hasOwnProperty('Sub-' + link + '-13to16');

            if (has5to8) {
                var sub5to8 = tournaments['Sub-' + link + '-5to8'];
                $target.append('<div/>');
                var $div5to8 = $target.children().last();
                var shifter = (tournaments[link].teams.length === 4) ? 'shiftTournament-1' : 'shiftTournament-2';
                $div5to8.addClass(shifter).attr('id', 'Sub-' + link + '-5to8');
                $div5to8.bracket({
                    init: sub5to8,
                    save: function () {},
                    decorator: {
                        edit: window.bracketOnEdit,
                        render: function () {
                            window.bracketOnRender.apply(this, arguments);
                            setTimeout(function () {
                                $div5to8.find('.bubble').each(function () {
                                    var current = parseInt($(this).text(), 10);
                                    if (current <= 4) {
                                        $(this).text((current + 4) + 'st');
                                    }
                                });
                            }, 400);
                        }
                    }
                });
                $div5to8.find('.jQBracket').css('width', '320px');
                $div5to8.find('.label, .score').addClass('editable');
            }

            if (has9to16) {
                var sub9to16 = tournaments['Sub-' + link + '-9to16'];
                $target.append('<div/>');
                var $div9to16 = $target.children().last();
                $div9to16.addClass('shiftTournament-1').attr('id', 'Sub-' + link + '-9to16');
                $div9to16.bracket({
                    init: sub9to16,
                    save: function () {},
                    decorator: {
                        edit: window.bracketOnEdit,
                        render: function () {
                            window.bracketOnRender.apply(this, arguments);
                            setTimeout(function () {
                                $div9to16.find('.bubble').each(function () {
                                    var current = parseInt($(this).text(), 10);
                                    if (current <= 4) {
                                        $(this).text((current + 8) + 'st');
                                    }
                                });
                            }, 400);
                        }
                    }
                });
                $div9to16.find('.jQBracket').css('width', '460px');
            }

            if (has13to16) {
                var sub13to16 = tournaments['Sub-' + link + '-13to16'];
                $target.append('<div/>');
                var $div13to16 = $target.children().last();
                $div13to16.addClass('shiftTournament-2').attr('id', 'Sub-' + link + '-13to16');
                $div13to16.bracket({
                    init: sub13to16,
                    save: function () {},
                    decorator: {
                        edit: window.bracketOnEdit,
                        render: function () {
                            window.bracketOnRender.apply(this, arguments);
                            setTimeout(function () {
                                $div13to16.find('.bubble').each(function () {
                                    var current = parseInt($(this).text(), 10);
                                    if (current <= 4) {
                                        $(this).text((current + 12) + 'st');
                                    }
                                });
                            }, 400);
                        }
                    }
                });
                $div13to16.find('.jQBracket').css('width', '320px');
                $div13to16.find('.label, .score').addClass('editable');
            }

            $('.tools').remove();

            $('.tournamentSaver').remove();
            if (window.isAdmin || allTournaments[link].owner_id === window.userId) {
                var $button = $('<button/>')
                                .addClass('btn btn-success tournamentSaver')
                                .attr('data-currentTournament', link)
                                .text('Envoyer les modifications')
                                .click(function () {
                                    saveIt.call(this, tournaments);
                                });
                $target.before($button);
            }

            $('.joinTournament').remove();
            var $join = $('<button/>')
                            .addClass('btn btn-success joinTournament')
                            .attr('data-currentTournament', link)
                            .text('Rejoindre le tournoi')
                            .click(function () {
                                joinIt.call(this, tournaments);
                            });
            $target.before($join);

            $('.pool').remove();
            if (allTournaments[link].data_pool) {
                var pools = window.poolify(allTournaments[link].data_pool);
                $target.before(pools);
            }
        });
    }
    render({});

    // Tournament saving
    /**
     * Save the tournament
     */
    function saveIt (tournaments) {
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

        // Save the main tournament
        var mainTournament = {
            title: tournament.name,
            data_teams: JSON.stringify(tournament.teams),
            data_results: JSON.stringify(tournament.results)
        };

        // Save the sub5to8
        var $sub5to8 = $('#Sub-' + tournament.id + '-5to8');
        if ($sub5to8.length !== 0) {
            var sub5to8tournament = $sub5to8.data().bracket.obj.data();
            mainTournament.data_teamsSub5to8 = JSON.stringify(sub5to8tournament.teams);
            mainTournament.data_resultsSub5to8 = JSON.stringify(sub5to8tournament.results);
        }
        // Save the sub9to16
        var $sub9to16 = $('#Sub-' + tournament.id + '-9to16');
        if ($sub9to16.length !== 0) {
            var sub9to16tournament = $sub9to16.data().bracket.obj.data();
            mainTournament.data_teamsSub9to16 = JSON.stringify(sub9to16tournament.teams);
            mainTournament.data_resultsSub9to16 = JSON.stringify(sub9to16tournament.results);
        }
        // Save the sub 13to16
        var $sub13to16 = $('#Sub-' + tournament.id + '-13to16');
        if ($sub13to16.length !== 0) {
            var sub13to16tournament = $sub13to16.data().bracket.obj.data();
            mainTournament.data_teamsSub13to16 = JSON.stringify(sub13to16tournament.teams);
            mainTournament.data_resultsSub13to16 = JSON.stringify(sub13to16tournament.results);
        }

        // Save the pool
        if (allTournaments[link].data_pool) {
            mainTournament.data_pool = window.unpoolify($('.pool').first().parent().parent());
        }

        $.ajax({
            type: 'PUT',
            url: '/tournaments/' + tournament.id,
            data: JSON.stringify(mainTournament),
            success: function () {
                location.reload();
            },
            error: function () {
                alert('Vous n\'avez pas les droits de modification');
            }
        });
    }

    /**
     * Join the tournament
     */
    function joinIt (tournaments) {
        var newTeam = window.prompt('Nom de votre team');
        var link = $(this).attr('data-currentTournament');
        var tournament = $.extend(true, {}, tournaments[link]);
        var teams = tournament.teams;

        var canJoin = false;
        var joined = false;
        teams.forEach(function (subTeams, i) {
            subTeams.forEach(function (team, j) {
                if (team === '--' && !joined) {
                    canJoin = true;
                    joined = true;
                    console.log(teams[i][j]);
                    teams[i][j] = newTeam;
                }
            });
        });

        if (!canJoin) {
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
