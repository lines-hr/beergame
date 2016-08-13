Template.gameSettings.onCreated(function () {
    Meteor.subscribe("GameSetup");
});

AutoForm.addHooks('insertGameSettingsForm', {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        console.log(arguments);
        return false;
    },
    onError: function (name, error, template) {
        console.log(name + " error:", error);
    }
});

SimpleSchema.debug = true;