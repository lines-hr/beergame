var setupId;

Template.editSettings.onCreated(function () {
    Meteor.subscribe('GameSetup');

    var self = this;

    this.getSetupId = () => FlowRouter.getParam('setupId');

    setupId = this.getSetupId();
});

Template.editSettings.events({
    'click .cancelSettings' : function (e) {
        e.preventDefault();
        FlowRouter.go('/lobby');
    }
});

Template.editSettings.helpers({
    updatedDoc: function () {
        var updatedDoc = GameSetup.findOne({ _id: setupId });

        if (updatedDoc) {
            return updatedDoc;
        }
    }
});

AutoForm.addHooks('updateSettingsForm', {
    onSuccess: function () {
        FlowRouter.go('/lobby');
    }
});