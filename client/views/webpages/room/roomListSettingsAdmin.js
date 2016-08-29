var Chart = require("chart");

Template.roomListSettingsAdmin.onCreated(function () {
    var self = this;

    this.getGameId = () => FlowRouter.getParam('gameId');

    gameId = this.getGameId();

    this.autorun(() => {
        this.subscribe('GameAdmin', this.getGameId(), function () {

            var chartData = new Array({x: 0, y: 0});
            if (self.getGameId()) {
                Game.findOne({_id: self.getGameId()}).__initDemand.forEach(function (d) {
                    chartData.push({x: d.roundNumber, y: d.demand});
                });

                scatterChart = new Chart($("#demandChart"), {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'Customer demand',
                            data: chartData,
                            lineTension: 0,
                            fill: false,
                            borderColor: "#337ab7"
                        }]
                    },
                    options: {
                        legend: {
                            display: false
                        },
                        scales: {
                            xAxes: [{
                                type: 'linear',
                                position: 'bottom',
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Game Rounds'
                                },
                                ticks: {
                                    min: 0,
                                    //stepSize: 1
                                }
                            }],
                            yAxes: [{
                                type: 'linear',
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Demand'
                                },
                                ticks: {
                                    min: 0
                                }
                            }]
                        }
                    }
                });
            }
        });
        this.subscribe('User');
    });

});

Template.roomListSettingsAdmin.helpers({
    adminGame: function () {
        var game = Game.findOne({_id: Template.instance().getGameId(), status: 'inLobby'});

        if (game && game.gameSetup) {
            var admin = Meteor.users.findOne({_id: game.gameAdmin});

            if (admin) {
                game.adminUsername = admin.username;

                game.shippings = (game.gameSetup.visibleShippings) ? 'Yes' : 'No';
                game.demands = (game.gameSetup.visibleDemands) ? 'Yes' : 'No';
                game.messaging = (game.gameSetup.allowMessaging) ? 'Yes' : 'No';

                return game;
            }
        }
    },
});