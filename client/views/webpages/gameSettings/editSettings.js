var setupId;

Template.editSettings.onCreated(function () {
    Meteor.subscribe('GameSetup');

    var self = this;

    this.getSetupId = () => FlowRouter.getParam('setupId');

    setupId = this.getSetupId();
});

Template.editSettings.events({
    'click .cancelSettings' : function () {
        FlowRouter.go('/lobby');
    }
});

Template.editSettings.helpers({
    updatedDoc: function() {
        var updatedDoc = GameSetup.findOne({ _id: setupId });

        if (updatedDoc) {
            return updatedDoc;
        }
    }
});

AutoForm.addHooks('updateSettingsForm', {
    //TODO yolo in production not needed
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        console.log(arguments);
        return false;
    },

    //TODO yolo in production not needed
    onError: function (name, error, template) {
        console.log(name + ' error:', error);
    },

    //TODO yolo
    /*
     formToDoc: function (doc) {
     demandSetup = doc.setup.initDemand;
     if(demandSetup)
     updateChart(demandSetup);
     },
     */

    onSuccess: function(formType, result) {
        FlowRouter.go('/lobby');
    }
});

//TODO yolo in production not needed
AutoForm.addHooks(null, {
    onError: function (name, error, template) {
        console.log(name + ' error:', error);
    }
});

//TODO yolo in production not needed
SimpleSchema.debug = true;