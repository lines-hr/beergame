var gameId;

Template.game.onCreated(function () {
    var self = this;

    this.getGameId = () => FlowRouter.getParam('gameId');

    gameId = this.getGameId();

    this.autorun(() => {
        this.subscribe('GameRoom', this.getGameId(), function () {
            self.autorun(function (c) {
                var game = Game.find({"_id": gameId, status: 'inProgress'}).count();
                if (game === 0){
                    c.stop();
                    FlowRouter.go("/lobby");
                }
            });
        });
        this.subscribe('User');
        this.subscribe('GameRound', this.getGameId(), function () {

        })
    });
});

Template.game.helpers({

    roundData: function () {
        var game = Game.findOne({_id: gameId});
        if(game){
            var player =_.find(game.players, function(p){return p.playerId === Meteor.userId()});
            if(player){
                var gameRound = GameRound.findOne({"gameId": gameId, "gameRound": game.currentRound});
                if(gameRound){

                    gameRound.position = player.position;
                    gameRound.username = Meteor.user().username;

                    var dataProperty = _.intersection(_.keys(gameRound), ["dataRetailer", "dataWholesaler", "dataDistributor", "dataFactory"]);
                    gameRound.data = gameRound[dataProperty];
                    delete gameRound[dataProperty];

                    return gameRound;
                }
            }
        }
    }

});