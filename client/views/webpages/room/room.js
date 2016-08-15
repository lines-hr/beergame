Template.room.onCreated(function () {
    Meteor.subscribe("GameSetup");
});

Template.room.helpers({
    name: function() {

        GameSetup.find({title: "Default Beergame"}).forEach(function(obj) {
            console.log(obj.setup.initStock);
        })

    }
})

