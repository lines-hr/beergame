Meteor.publish("GameSetup", function () {
    return GameSetup.find();
});