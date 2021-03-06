Meteor.publish('GameSetup', function () {
    return GameSetup.find({ $or: [ { setupOwner: this.userId }, { isGlobal: true } ] });
});

GameSetup.allow({
    insert: function (userId, doc) {
        return !!userId && ( ('isGlobal' in doc && !doc.isGlobal) || !('isGlobal' in doc) );
    },

    remove: function(userId, doc) {
        return !!userId && doc.setupOwner === userId;
    },

    update: function(userId, doc) {
        return !!userId && doc.setupOwner === userId;
    }
});