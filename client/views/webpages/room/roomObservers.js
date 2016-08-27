var gameId;

Template.room.onCreated(function () {
    var self = this;

    this.getGameId = () => FlowRouter.getParam('gameId');

    gameId = this.getGameId();

    this.autorun(() => {
        this.subscribe('GameRoom', this.getGameId());
    });
});

Template.roomObservers.helpers({
    activeRetailer: function() {
        var game = Game.findOne({_id: gameId});

        if (game){
            var needle = _.find(game.players, function(p){
                return p.position === 'Retailer';
            });

            return (needle) ? false : true;
        } else {
            return true;
        }
    },

    activeWholesailer: function() {
        var game = Game.findOne({_id: gameId});

        if (game){
            var needle = _.find(game.players, function(p){
                return p.position === 'Wholesailer';
            });

            return (needle) ? false : true;
        } else {
            return true;
        }
    },

    activeDistributor: function() {
        var game = Game.findOne({_id: gameId});

        if (game){
            var needle = _.find(game.players, function(p){
                return p.position === 'Distributor';
            });

            return (needle) ? false : true;
        } else {
            return true;
        }
    },

    activeFactory: function() {
        var game = Game.findOne({_id: gameId});

        if (game){
            var needle = _.find(game.players, function(p){
                return p.position === 'Factory';
            });

            return (needle) ? false : true;
        } else {
            return true;
        }
    }
});
