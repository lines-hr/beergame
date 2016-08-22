Meteor.publish('Game', function () {
    return Game.find();
});

Game.allow({
    insert: function (userId, doc) {
        return userId;
    },

    remove: function (userId){
        return userId;
    },

    update: function (userId){
        return userId;
    }
});