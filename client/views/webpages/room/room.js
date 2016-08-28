const NUMBER_OF_PLAYERS = 1;

var gameId;

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

Template.room.onCreated(function () {
    var self = this;

    this.getGameId = () => FlowRouter.getParam('gameId');

    gameId = this.getGameId();

    toastr.options = {
        "positionClass": "toast-top-right",
        "preventDuplicates": true
    }

    this.autorun(() => {
        this.subscribe('GameAdmin', this.getGameId());
        this.subscribe('GameRoom', this.getGameId(), function () {

            var cursorGame = Game.find({"_id": gameId}, {fields: {players: 1}});
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
                            toastr["success"]("All players are ready! Waiting for administrator to start the game.");
                        }

                        if (olddoc.players) {
                            olddoc.players.forEach(function (p) {
                                oldPlayerIds.push(p.playerId);
                            });
                        }

                        var inPlayer = _.difference(newPlayerIds,oldPlayerIds)[0];
                        var outPlayer = "";
                        if (typeof inPlayer === "undefined")
                            outPlayer = _.difference(oldPlayerIds, newPlayerIds)[0];

                        if(typeof inPlayer !== "undefined"){
                            var user = Meteor.users.findOne({_id: inPlayer});
                            var game = Game.findOne({_id: gameId});
                            if(user && game){
                                var player = _.find(game.players, function (p) {
                                    return p.playerId === user._id;
                                });

                                if(player) {
                                    if (player.playerId === Meteor.userId()) {
                                        toastr["success"]("You are assigned to " + player.position + ".");
                                    } else {
                                        toastr["info"]("User " + user.username + " assigned to " + player.position + ".");
                                    }
                                }
                            }
                        }

                        if(typeof outPlayer !== "undefined"){
                            var user = Meteor.users.findOne({_id: outPlayer});
                            if(user) {
                                if (user._id === Meteor.userId()) {
                                    toastr["warning"]("You have been unassigned.");
                                } else {
                                    toastr["info"]("User " + user.username + " unassigned.");
                                }
                            }
                        }
                    }
                });
            }

            self.autorun(function (c) {
                var game = Game.findOne({"_id": gameId});
                if (!game){
                    observerHandle.stop();
                    c.stop();
                    FlowRouter.go("/lobby");
                } else {
                    if(game && game.status === "inProgress"){
                        observerHandle.stop();
                        c.stop();
                        FlowRouter.go("/game/" + game._id);
                    }
                }
            });

        });

        this.subscribe('User');
    });


});

Template.room.events({
    'click #cancelGame': function () {
        Meteor.call('Game.room.events.cancelGame');
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
                o.player = _.find(users, function(obj){
                    if (obj._id === o.playerId){
                        return obj.username;
                    }
                });
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

                game.shippings = (typeof game.gameSetup.visibleShippings !== "undefined") ? 'Yes' : 'No';
                game.demands = (typeof game.gameSetup.visibleDemands !== "undefined") ? 'Yes' : 'No';
                game.messaging = (typeof game.gameSetup.allowMessaging !== "undefined") ? 'Yes' : 'No';

                return game;
            }
        }
    },

    allPlayersReady: function () {
        var game = Game.findOne({_id: gameId, status: 'inLobby'});
        var numPlayers = 0;
        if(game && game.players){
            game.players.forEach(function(p){
                if(p.isReady) numPlayers++;
            });
            return (numPlayers === NUMBER_OF_PLAYERS) ? true : false;
        }
        return false;
    }
});



/*
var gameId = '';

Template.room.onCreated(function () {
    gameId = FlowRouter.getParam('gameId');
    Meteor.subscribe('GameAdmin', gameId);
    Meteor.subscribe('GameUser', gameId);
    Meteor.subscribe('RoomUser', gameId);
});

Template.room.events({
    'click #startGame': function (e) {
        Meteor.call('Game.room.events.startGame');
    },

    'click #ready': function (e) {
        const status = e.target.value;

        if (status === "ready") {
            Meteor.call('Game.room.events.ready', true);
        } else {
            Meteor.call('Game.room.events.ready', false);
        }
    },

    /!*  *!/
    'click .toObserve': function (e) {
        removedUserId = e.target.value;
        Meteor.call('Game.room.events.toObserver', removedUserId);
    },

    /!* Join game *!/
    'click .toPlay': function (e) {
        addedUserId = e.target.value;
        Meteor.call('Game.room.events.toPlay', addedUserId);
    },

    /!* Exiting room for joined user *!/
    'click #exitRoom': function () {
        Meteor.call('Game.room.events.exitRoom');
        FlowRouter.go('/lobby');
    },

    /!* Cancelling game and deleting game *!/
    'click #cancelGame': function () {
        Meteor.call('GameSetup.room.events.cancelGame');
        Meteor.call('Game.room.events.cancelGame');
        FlowRouter.go('/lobby');
    }
});

Template.room.helpers({
    /!* Redirect to game if 'inProgress'*!/
    summon: function () {
        const summon = Meteor.apply('Game.helpers.summon', [], { returnStubValue: true });

        if (summon) {
            FlowRouter.go('/game');
        }
    },

    /!**!/
    allPlayersReady: function () {
        return Meteor.apply('Game.room.helpers.allPlayersReady', [], { returnStubValue: true });
    },

    /!* Check if player is ready *!/
    ready: function () {
        return Meteor.apply('Game.room.helpers.ready', [], { returnStubValue: true });
    },

    /!* Check if user is in room *!/
    inRoom: function () {
        return Meteor.apply('Game.room.helpers.inRoom', [], { returnStubValue: true });
    },

    /!* Check if user is added *!/
    added: function () {
        return Meteor.apply('Game.room.helpers.added', [], { returnStubValue: true });
    },

    /!* Check if admin *!/
    admin: function () {
        return Meteor.apply('Game.room.helpers.admin', [], { returnStubValue: true });
    },

    /!* Listing observers on game admin side *!/
    listObservers: function() {
        const game = Game.findOne({_id: gameId});
        var observers = [];

        game.observers.forEach(function (obj) {
            observers.push(obj.observerId);
        });

        return Meteor.users.find({
            _id:
            {
                $in: observers
            }
        }).fetch();
        /!*
        game.observers.forEach(function (obj) {
            if (Meteor.users.findOne(obj.observerId)) {
                const observer = Meteor.users.findOne(obj.observerId);
                observers.push({user: observer}, {userId: obj.observerId})
            }
        });

        return observers;*!/

        //return Meteor.apply('Game.room.helpers.listObservers', [], { returnStubValue: true });
    },

    /!* Listing players on game admin side *!/
    listPlayers: function() {
        return Meteor.apply('Game.room.helpers.listPlayers', [], { returnStubValue: true });

        //players.push({player: obj2.playerId, position: obj2.id});
        //return players.sort(function(a,b) {return (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0);} );
    },

    /!* Players positions *!/
    positions: function() {
        return Meteor.apply('Game.room.helpers.positions', [], { returnStubValue: true });
    },

    /!* Game info in room after game is created *!/
    getGameSettings: function() {
        return Meteor.apply('Game.room.helpers.getGameSettings', [], { returnStubValue: true });
    }
});
*/
