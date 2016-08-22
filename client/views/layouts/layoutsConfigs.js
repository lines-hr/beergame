Template.headerLayout.helpers({
    /* Checks if links are active for active link display in navigation */
    activeIfTemplateIs: function (template) {
        //TODO maknuti komentar kasnije return FlowRouter.getRouteName() && template === currentRoute ? 'active' : '';
    },

    /* Checks if game has status 'inProgress' and if true then game page is allowed to be visible */
    // TODO
    gameInProgress: function () {
    }
});

Template.footerLayout.helpers({
    /* Prints current year in footer */
    copyrightDate: function () {
        return new Date().toString().substr(11, 4);
    }
});