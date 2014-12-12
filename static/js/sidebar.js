/* jshint strict: true, undef: true, browser: true, jquery: true */

(function () {
    'use strict';

    $.ajax({
        type: 'get',
        url: '/user',
        success: function (msg) {
            window.colors = {
                0: ['Rouge', 'rgba(255, 0, 0, 0.6)', '#fff'],
                1: ['Bleue', 'rgba(0, 0, 255, 0.6)', '#fff']
            };

            window.isAdmin = msg.admin;
            window.userId = msg.id;

            $('#points').text('Points : ' + msg.point).css('color', '#fff');
            $('#color').css({
                fontWeight: 'bold',
                color: colors[msg.color][2],
                backgroundColor: colors[msg.color][1]
            }).text('Équipe ' + colors[msg.color][0]);
        }
    });

    $('#logout').off('click').click(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/logout',
            success: function () {
                location.reload();
            }
        });
    });

    $('#checkUser').off('click').click(function (e) {
        e.preventDefault();
        var username = window.prompt('Nom de l\'utilisateur ?');
        if (username) {
            alert('Demandez le prénom et le nom de famillle de la personne, et vérifiez sur arena.utt.fr, avant de lui donner l\'indice !');
            $.ajax({
                type: 'get',
                url: '/usersScores/' + username,
                success: function (msg) {
                    alert('Nombre de points : ' + msg.point);
                },
                error: function () {
                    alert('Utilisateur non trouvé');
                }
            });
        }
    });

}());
