Template.headerLayout.helpers({
    activeIfTemplateIs: function (template) {
        var currentRoute = FlowRouter.getRouteName();
        return currentRoute && template === currentRoute ? 'active' : '';
    },
    gameInProgress: function () {
        if (Game.find({gameAdmins: Meteor.userId(), gameStatus: "inGame"}).count() === 1) {
            return true;
        } if (Game.find({"players.playerId": Meteor.userId(), gameStatus: "inGame"}).count() === 1) {
            return true;
        } else {
            return false;
        }
    }
});

Template.footerLayout.helpers({
    copyrightDate: function () {
        var dt = new Date();
        return dt.toString().substr(11, 4);
    }
});