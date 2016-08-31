var Chart = require('chart');
var gameId;

Template.score.onCreated(function () {
    var self = this;

    this.getGameId = () => FlowRouter.getParam('gameId');

    gameId = this.getGameId();

    this.autorun(() => {
        this.subscribe('GameScore', gameId);
        this.subscribe('User');

        this.subscribe('GameRoundScore', gameId, function () {
            if (self.getGameId()) {
                // Graph 1
                // part 1
                var numRounds = Game.findOne({ _id: self.getGameId(), status: 'finished' }).numRounds;

                var finalRound = GameRound.findOne({ gameId: self.getGameId(), gameRound: numRounds });

                if (finalRound) {
                    var retailerTotalData = finalRound.dataRetailer.costSum;
                    var wholesalerTotalData = finalRound.dataWholesaler.costSum;
                    var distributorTotalData = finalRound.dataDistributor.costSum;
                    var factoryTotalData = finalRound.dataFactory.costSum;
                }

                // part 2
                var retailerMaxOrderData = 0;
                var wholesalerMaxOrderData = 0;
                var distributorMaxOrderData = 0;
                var factoryMaxOrderData = 0;

                GameRound.find({ gameId: self.getGameId() }).forEach(function (obj) {
                    if (retailerMaxOrderData < obj.dataRetailer.myOrder) {
                        retailerMaxOrderData = obj.dataRetailer.myOrder;
                    }
                    if (wholesalerMaxOrderData < obj.dataWholesaler.myOrder) {
                        wholesalerMaxOrderData = obj.dataWholesaler.myOrder;
                    }
                    if (distributorMaxOrderData < obj.dataDistributor.myOrder) {
                        distributorMaxOrderData = obj.dataDistributor.myOrder;
                    }
                    if (factoryMaxOrderData < obj.dataFactory.myOrder) {
                        factoryMaxOrderData = obj.dataFactory.myOrder;
                    }
                });

                // part 3
                var retailerTotalBackorderData = finalRound.dataRetailer.backorder;
                var wholesalerTotalBackorderData = finalRound.dataWholesaler.backorder;
                var distributorTotalBackorderData = finalRound.dataDistributor.backorder;
                var factoryTotalBackorderData = finalRound.dataFactory.backorder;

                var data = {
                    labels: ['Retailer', 'Wholesaler', 'Distributor', 'Factory'],
                    datasets: [
                        {
                            label: 'Total Cost',
                            backgroundColor: '#ff6188',
                            data: [retailerTotalData, wholesalerTotalData, distributorTotalData, factoryTotalData]
                        },
                        {
                            label: 'Highest Order',
                            backgroundColor: '#337ab7',
                            data: [retailerMaxOrderData, wholesalerMaxOrderData, distributorMaxOrderData, factoryMaxOrderData]
                        },
                        {
                            label: 'Final Backorder',
                            backgroundColor: '#000',
                            data: [retailerTotalBackorderData, wholesalerTotalBackorderData, distributorTotalBackorderData, factoryTotalBackorderData]
                        }
                    ]
                };

                barChart = new Chart($('#totalCostChart'), {
                    type: 'bar',
                    data: data,
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    min: 0
                                }
                            }]
                        }
                    }
                });


                // Graph 2
                var retailerData = new Array({x: 0, y: 0});
                var wholesalerData = new Array({x: 0, y: 0});
                var distributorData = new Array({x: 0, y: 0});
                var factoryData = new Array({x: 0, y: 0});

                GameRound.find({ gameId: self.getGameId() }).forEach(function (obj) {
                    retailerData.push({x: obj.gameRound, y: obj.dataRetailer.costSum});
                    wholesalerData.push({x: obj.gameRound, y: obj.dataWholesaler.costSum});
                    distributorData.push({x: obj.gameRound, y: obj.dataDistributor.costSum});
                    factoryData.push({x: obj.gameRound, y: obj.dataFactory.costSum});
                });

                lineChart = new Chart($('#costPerRoundsChart'), {
                    type: 'line',
                    data: {
                        datasets: [
                            {
                                label: 'Retailer',
                                data: retailerData,
                                lineTension: 0,
                                fill: false,
                                borderColor: '#ff0'
                            },
                            {
                                label: 'Wholesaler',
                                data: wholesalerData,
                                lineTension: 0,
                                fill: false,
                                borderColor: '#f00'
                            },
                            {
                                label: 'Distributor',
                                data: distributorData,
                                lineTension: 0,
                                fill: false,
                                borderColor: '#0f0'
                            },
                            {
                                label: 'Factory',
                                data: factoryData,
                                lineTension: 0,
                                fill: false,
                                borderColor: '#00f'
                            }
                        ]
                    },
                    options: {
                        legend: {
                            display: true
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
                                    min: 0
                                }
                            }],
                            yAxes: [{
                                type: 'linear',
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Cost (lesser is better)'
                                },
                                ticks: {
                                    min: 0
                                }
                            }]
                        }
                    }
                });


                // Graph 3
                var demandData = new Array({x: 0, y: 0});

                if (self.getGameId()) {
                    Game.findOne({_id: self.getGameId()}).__initDemand.forEach(function (d) {
                        demandData.push({x: d.roundNumber, y: d.demand});
                    });

                    demandChart = new Chart($("#demandChart"), {
                        type: 'line',
                        data: {
                            datasets: [{
                                label: 'Demand',
                                data: demandData,
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
                                        min: 0
                                    }
                                }],
                                yAxes: [{
                                    type: 'linear',
                                    display: true,
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Customer Demands'
                                    },
                                    ticks: {
                                        min: 0
                                    }
                                }]
                            }
                        }
                    });
                }
            }
        });
    });
});

Template.score.events({
    'click .lobbyReturn': function (e) {
        e.preventDefault();

        FlowRouter.go('/lobby');
    }
});

Template.score.helpers({
    listScores: function () {
        if (Meteor.userId()) {
            var game = Game.findOne({_id: gameId, status: 'finished'});

            if (game) {
                var gameRound = GameRound.findOne({'gameId': gameId, 'gameRound': game.numRounds});

                if (gameRound){
                    var scores = new Array();

                    game.players.forEach(function (p) {
                        var user = Meteor.users.findOne({ '_id': p.playerId });

                        if (user) {
                            switch (p.position) {
                                case 'Retailer' :
                                    scores.push({
                                        username: user.username,
                                        avatar: user.profile.emailHash,
                                        position: 'Retailer',
                                        totalCost: gameRound.dataRetailer.costSum
                                    });
                                    break;
                                case 'Wholesaler' :
                                    scores.push({
                                        username: user.username,
                                        avatar: user.profile.emailHash,
                                        position: 'Wholesaler',
                                        totalCost: gameRound.dataWholesaler.costSum
                                    });
                                    break;
                                case 'Distributor' :
                                    scores.push({
                                        username: user.username,
                                        avatar: user.profile.emailHash,
                                        position: 'Distributor',
                                        totalCost: gameRound.dataDistributor.costSum
                                    });
                                    break;
                                case 'Factory' :
                                    scores.push({
                                        username: user.username,
                                        avatar: user.profile.emailHash,
                                        position: 'Factory',
                                        totalCost: gameRound.dataFactory.costSum
                                    });
                                    break;
                            }
                        }
                    });

                    scores.sort(function(a, b) {
                        return parseFloat(a.totalCost) - parseFloat(b.totalCost);
                    });

                    return scores;
                }
            }
        }
    }
});
