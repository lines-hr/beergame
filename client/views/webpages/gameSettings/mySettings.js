Template.mySettings.events({
    'click .removeSetup': function (e) {
        e.preventDefault();

        GameSetup.remove({ _id: this._id });
    },

    'click .loadMySetup': function () {
        Session.set('gameLoadId', this._id);
    }
});

Template.mySettings.helpers({
    isOwner: function () {
        if (this.setupOwner === Meteor.userId()) {
            return true;
        } else {
            return false;
        }
    },

    isGlobal: function () {
        if (this.isGlobal) {
            return true;
        } else {
            return false;
        }
    }
});