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
                FlowRouter.go('/room/' + condition._id);
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
        
        Game.find({ 'status': 'inLobby' }).forEach(function (g) {
            if (admin = Meteor.users.findOne({ _id: g.gameAdmin })) {
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
        return Game.find({'status': 'inLobby'}).count() === 0 ? true : false;
    }
});