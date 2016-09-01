const NUMBER_OF_PLAYERS = 4;

var gameId;

Template.room.onCreated(function () {
    var self = this;

    this.getGameId = () => FlowRouter.getParam('gameId');

    gameId = this.getGameId();

    toastr.options = {
        'positionClass': 'toast-top-right',
        'preventDuplicates': true
    }

    this.autorun(() => {
        this.subscribe('GameAdmin', this.getGameId());
        this.subscribe('GameRoom', this.getGameId(), function () {
            var cursorGame = Game.find({ '_id': gameId }, { fields: {players: 1} });
            var observerHandle;
            
            if(cursorGame){
                observerHandle = cursorGame.observe({
                    changed: function (newdoc, olddoc) {
                        var newPlayerIds = new Array();
                        var oldPlayerIds = new Array();
                        var numPlayersReady = 0;

                        if (newdoc.players) {
                            newdoc.players.forEach(function (p) {
                                newPlayerIds.push(p.playerId);
                                if (p.isReady) numPlayersReady++;
                            });
                        }

                        if (numPlayersReady === NUMBER_OF_PLAYERS){
                            toastr['success']('All players are ready!');
                        }

                        if (olddoc.players) {
                            olddoc.players.forEach(function (p) {
                                oldPlayerIds.push(p.playerId);
                            });
                        }

                        var inPlayer = _.difference(newPlayerIds,oldPlayerIds)[0];
                        var outPlayer = '';

                        if (typeof inPlayer === 'undefined')
                            outPlayer = _.difference(oldPlayerIds, newPlayerIds)[0];

                        if(typeof inPlayer !== 'undefined'){
                            var user = Meteor.users.findOne({ _id: inPlayer });
                            var game = Game.findOne({ _id: gameId });

                            if(user && game){
                                var player = _.find(game.players, function (p) {
                                    return p.playerId === user._id;
                                });

                                if(player) {
                                    if (player.playerId === Meteor.userId()) {
                                        toastr['success']('You are assigned to ' + player.position + '.');
                                    } else {
                                        toastr['info']('User ' + user.username + ' assigned to ' + player.position + '.');
                                    }
                                }
                            }
                        }

                        if(typeof outPlayer !== 'undefined'){
                            var user = Meteor.users.findOne({ _id: outPlayer });

                            if(user) {
                                if (user._id === Meteor.userId()) {
                                    toastr['warning']('You have been unassigned.');
                                } else {
                                    toastr['info']('User ' + user.username + ' unassigned.');
                                }
                            }
                        }
                    }
                });
            }

            self.autorun(function (c) {
                var game = Game.findOne({ '_id': gameId });

                if (!game || game.status === 'cancelled'){
                    observerHandle.stop();
                    c.stop();

                    if(game && game.status === 'cancelled'){
                        if(Meteor.userId() === game.gameAdmin){
                            toastr['info']('Game cancelled');
                        } else {
                            toastr['warning']('Administrator cancelled the game.');
                        }
                    }

                    FlowRouter.go('/lobby');
                } else {
                    if(game && game.status === 'inProgress'){
                        observerHandle.stop();
                        c.stop();
                        FlowRouter.go('/game/' + game._id);
                    }
                }
            });

        });
        this.subscribe('User');
    });
});

Template.room.events({
    'click #cancelGame': function () {
        Meteor.call('Game.room.events.cancelGame', gameId);
        FlowRouter.go('/lobby');
    },

    'click #exitRoom': function () {
        Meteor.call('Game.room.events.exitRoom', gameId);
        FlowRouter.go('/lobby');
    },

    'click .position': function (e) {
        Meteor.call('Game.room.events.toPlayer', this._id, e.target.text);
    },

    'click .toObserver': function () {
        Meteor.call('Game.room.events.toObserver', this.playerId);
    },

    'click #toggleReady': function () {
        Meteor.call('Game.room.events.toggleReady', gameId);
    },

    'click #startGame': function () {
        Meteor.call('Game.room.events.startGame', gameId);
    }
});

Template.registerHelper('isGameAdmin', function () {
    var game = Game.findOne({ _id: gameId });

    if (typeof game !== 'undefined') {
        if (game.gameAdmin === Meteor.userId()) {
            return true;
        } else {
            return false;
        }
    }
});

Template.registerHelper('isPlayer', function () {
    var game = Game.findOne({ _id: gameId });

    if (game) {
        var player = _.find(game.players, function(p){
            return p.playerId === Meteor.userId();
        });

        return (player) ? true : false;
    } else {
        return false;
    }
});

Template.room.helpers({
    listObservers: function () {
        const game = Game.findOne({_id: gameId});
        var observers = [];

        if (game && game.observers) {
            game.observers.forEach(function (obj) {
                observers.push(obj.observerId);
            });

            return Meteor.users.find({
                _id: {
                    $in: observers
                }
            }).fetch();
        }
    },

    listPlayers: function () {
        var game = Game.findOne({_id: gameId});
        var users = Meteor.users.find().fetch();

        if (game && users && game.players) {
            game.players.forEach(function(o){
                var player = _.find(users, function(obj){
                    return obj._id === o.playerId;
                });

                if (player) {
                    o.username = player.username;
                    var iconClass;

                    switch (o.position) {
                        case 'Retailer':
                            iconClass = 'fa fa-home';
                            break;

                        case 'Wholesaler':
                            iconClass = 'fa fa-building';
                            break;

                        case 'Distributor':
                            iconClass = 'fa fa-truck';
                            break;

                        case 'Factory':
                            iconClass = 'fa fa-industry';
                            break;
                    }
                    o.iconClass = iconClass;
                }
            });

            return game.players;
        }
    },

    playerReady: function () {
        var game = Game.findOne({_id: gameId, status: 'inLobby'});

        if (game) {
            var player = _.find(game.players, function(p){
                return p.playerId === Meteor.userId() && p.isReady === true;
            });

            return (player) ? true : false;
        } else {
            return false;
        }
    },

    game: function () {
        var game = Game.findOne({_id: gameId, status: 'inLobby'});

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

    allPlayersReady: function () {
        var game = Game.findOne({ _id: gameId, status: 'inLobby' });
        var numPlayers = 0;

        if(game && game.players){
            game.players.forEach(function(p){
                if(p.isReady) numPlayers++;
            });

            return (numPlayers === NUMBER_OF_PLAYERS) ? true : false;
        }
        return false;
    },

    me: function (userId) {
        return Meteor.userId() === userId;
    }
});