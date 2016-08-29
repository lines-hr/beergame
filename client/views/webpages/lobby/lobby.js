Template.lobby.onCreated(function () {
    var self = this;

    this.autorun(() => {
        this.subscribe('GameLobby', function () {
            var condition = Game.findOne(
                {
                    $and: [
                        {
                            $or: [
                                { gameAdmin: Meteor.userId() },
                                { 'observers.observerId': Meteor.userId() },
                                { 'players.playerId': Meteor.userId() }
                            ]
                        },
                        {
                            $or: [
                                { status: 'inLobby' },
                                { status: 'inProgress' }
                            ]
                        }
                    ]
                });

            if (condition){
                FlowRouter.go("/room/" + condition._id);
            }
        });
        this.subscribe('User');
    });
});

Template.lobby.events({
    'click .newGameBtn': function(e) {
        e.preventDefault();

        $('#newGameModal').modal('show');
    }
});

Template.lobby.helpers({
    lobbyGames: function() {
        lobbyGames = new Array();
        Game.find({"status": "inLobby"}).forEach(function (g) {
            if (admin = Meteor.users.findOne({_id: g.gameAdmin})) {
                lobbyGames.push({
                    _id: g._id,
                    title: g.title,
                    gameAdmin: admin.username,
                    numRounds: g.numRounds,
                    numPlayers: _.size(g.players),
                    numObservers: _.size(g.observers),
                    status: g.status
                });
            }
        });
        return lobbyGames;
    },
    noGames: function () {
        return Game.find({"status": "inLobby"}).count() === 0 ? true : false;
    }
});






/*
Template.lobby.onCreated(function () {
    Meteor.subscribe('GameLobby');
    Meteor.subscribe('LobbyUser');
});

Template.lobby.events({
    /!* New game button in lobby *!/
    'click #newGameBtn': function(e) {
        e.preventDefault();
        
        $('#newGameModal').modal('show');
    }
});

Template.lobby.helpers({
    /!* Redirect to game if 'inProgress'*!/
    summon: function () {
        const summon = Meteor.apply('Game.helpers.summon', [], { returnStubValue: true });

        if (summon) {
            FlowRouter.go('/game');
        }
    },

    /!* Returning all 'inLobby' games *!/
    // TODO RADI
    lobbyGames: function () {
        lobbyGames = []

        Game.find().forEach(function (obj) {
            if (user = Meteor.users.findOne(obj._id)) {
                lobbyGames.push({_id: obj._id, title: obj.title, gameAdmin: user.username});
            } else {
                lobbyGames.push({_id: obj._id, title: obj.title, gameAdmin: 'John Yolo'});
            }
        });

        return lobbyGames;
    },

    /!* Conditions for creating game *!/
    enableCreate: function () {
        return Meteor.apply('Game.helpers.enableUser', [], { returnStubValue: true });
    }
});*/
