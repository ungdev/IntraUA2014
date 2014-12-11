/* jshint strict: true, undef: true, browser: true, jquery: true */
/* global moment */

(function () {
    'use strict';

    var canvas = $('canvas')[0];
    var ctx = canvas.getContext('2d');
    var teamsChart = null;

    var $firstOne  = $('#firstOne');
    var $secondOne = $('#secondOne');
    var $thirdOne  = $('#thirdOne');

    function refresh () {
        $.ajax({
            type: 'get',
            url: '/usersScores',
            success: function (msg) {
                var sidebarWrapperWidth = $('#sidebar-wrapper').width();
                var hasSidebar = (sidebarWrapperWidth !== 0);

                if (!hasSidebar) {
                    ctx.canvas.width  = window.innerWidth - 50;
                    ctx.canvas.height = window.innerHeight - 300;
                } else {
                    ctx.canvas.width  = window.innerWidth - sidebarWrapperWidth - 50;
                    ctx.canvas.height = window.innerHeight - 300;
                }

                var teams = [];
                var names = [];
                Object.keys(colors).forEach(function (color) {
                    teams.push(color);
                    names.push(colors[color][0]);
                });

                var dataset = [{
                    label: 'Scores',
                    fillColor: 'rgba(220,220,220,0.5)',
                    strokeColor: 'rgba(220,220,220,0.8)',
                    highlightFill: 'rgba(220,220,220,0.75)',
                    highlightStroke: 'rgba(220,220,220,1)',
                    data: []
                }];
                Object.keys(msg).forEach(function (teamId) {
                    var teamPoint = msg[teamId];
                    dataset[0].data.push(teamPoint);
                });

                if (teamsChart) {
                    dataset[0].data.forEach(function (v, i) {
                        teamsChart.datasets[0].bars[i].value = v;
                    });
                    teamsChart.update();
                } else {
                    teamsChart = new Chart(ctx).Bar({
                        labels: names,
                        datasets: dataset
                    });
                    Object.keys(colors).forEach(function (color) {
                        var barColor = colors[color][1];
                        teamsChart.datasets[0].bars[color].fillColor = barColor;
                        teamsChart.datasets[0].bars[color]._saved.fillColor = barColor;

                        teamsChart.datasets[0].bars[color].highlightFill = barColor.replace('0.6', '0.75');
                        teamsChart.datasets[0].bars[color]._saved.highlightFill = barColor.replace('0.6', '0.75');

                        teamsChart.datasets[0].bars[color].highlightStroke = barColor.replace('0.6', '1');
                        teamsChart.datasets[0].bars[color]._saved.highlightStroke = barColor.replace('0.6', '1');

                        teamsChart.datasets[0].bars[color].strokeColor = barColor.replace('0.6', '0.8');
                        teamsChart.datasets[0].bars[color]._saved.strokeColor = barColor.replace('0.6', '0.8');
                        console.log(teamsChart.datasets[0].bars[color], barColor);
                    });
                    teamsChart.datasets[0].bars
                }
                setTimeout(refresh, 4000);
            }
        });
        $.ajax({
            type: 'get',
            url: '/best/',
            success: function (msg) {
                msg.forEach(function (bestOne, i) {
                    if (i === 0) {
                        $firstOne.text(bestOne.username + ' : ' + bestOne.point + ' points');
                        console.log(colors[bestOne.color][1]);
                        $firstOne.css({
                            color: colors[bestOne.color][1],
                            fontWeight: 'bold',
                            padding: '4px'
                        });
                    } else if (i === 1) {
                        $secondOne.text(bestOne.username + ' : ' + bestOne.point + ' points');
                        $secondOne.css({
                            color: colors[bestOne.color][1],
                            fontWeight: 'bold',
                            padding: '4px'
                        });
                    } else if (i === 2) {
                        $thirdOne.text(bestOne.username + ' : ' + bestOne.point + ' points');
                        $thirdOne.css({
                            color: colors[bestOne.color][1],
                            fontWeight: 'bold',
                            padding: '4px'
                        });
                    }
                });
            }
        });
    }

    refresh();
}());
