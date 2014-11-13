/* jshint strict: true, undef: true, browser: true, jquery: true */

(function () {
    'use strict';
    var challenges = {
        challenge1: {
            id: 1,
            title: 'Défi 1',
            description: 'Truc truc'
        }
    };

    // Render links
    var $challengesList = $('#challengesList');
    Object.keys(challenges).forEach(function (name, index) {
        var $li = $('<li/>');
        var $a = $('<a/>')
                    .attr('href', '#')
                    .attr('data-challenge', name);
        var $h4 = $('<h4/>')
                    .text(challenges[name].title);

        $h4.appendTo($a);
        $a.appendTo($li);
        $challengesList.append($li);
    });

    // Events
    var $links          = $('[data-challenge]');
    var $allChallenges  = $('#allChallenges');
    var $oneChallenge   = $('#oneChallenge');
    var $challengeTitle = $('#challengeTitle');
    var $challengeDescr = $('#challengeDescr');

    $links.off('click').click(function (e) {
        e.preventDefault();

        var $self = $(this);
        var link = $self.attr('data-challenge');

        if (!link || !challenges.hasOwnProperty(link)) {
            return;
        }

        var challenge = challenges[link];

        $challengeTitle.text(challenge.title);
        $challengeDescr.text(challenge.description);

        $allChallenges.hide();
        $oneChallenge.show();
    });
}());
