Template.roomObservers.helpers({
    activeRetailer: function() {
        var game = Game.findOne({ _id: gameId });

        if (game){
            var needle = _.find(game.players, function(p){
                return p.position === 'Retailer';
            });

            return (needle) ? false : true;
        } else {
            return true;
        }
    },

    activeWholesaler: function() {
        var game = Game.findOne({ _id: gameId });

        if (game){
            var needle = _.find(game.players, function(p){
                return p.position === 'Wholesaler';
            });

            return (needle) ? false : true;
        } else {
            return true;
        }
    },

    activeDistributor: function() {
        var game = Game.findOne({ _id: gameId });

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
        var game = Game.findOne({ _id: gameId });

        if (game){
            var needle = _.find(game.players, function(p){
                return p.position === 'Factory';
            });

            return (needle) ? false : true;
        } else {
            return true;
        }
    },

    me: function (userId) {
        return Meteor.userId() === userId;
    }
});

