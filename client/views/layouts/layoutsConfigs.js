Template.headerLayout.helpers({
    activeIfTemplateIs: function (template) {
        var currentRoute = FlowRouter.getRouteName();
        return currentRoute && template === currentRoute ? 'active' : '';
    }
});

Template.footerLayout.helpers({
    copyrightDate: function () {
        var dt = new Date();
        return dt.toString().substr(11, 4);
    }
});