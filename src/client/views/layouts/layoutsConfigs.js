Template.headerLayout.helpers({
    /* Checks if links are active for active link display in navigation */
    activeIfTemplateIs: function (template) {
        return FlowRouter.getRouteName() && template === currentRoute ? 'active' : '';
    }
});

Template.footerLayout.helpers({
    /* Prints current year in footer */
    copyrightDate: function () {
        return new Date().toString().substr(11, 4);
    }
});