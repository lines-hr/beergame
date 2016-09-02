Template.listSettings.events({
    'click .removeSetup': function (e) {
        e.preventDefault();

        GameSetup.remove({ _id: this._id });
    },

    'click .editSetup': function () {
        FlowRouter.go('/editSettings/' + this._id);
    }
});

Template.listSettings.helpers({
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