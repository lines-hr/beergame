FlowRouter.route('/', {
    name: 'index',
    action(params, queryParams) {
        BlazeLayout.render("mainLayout", {main: 'index'});
    }
});

FlowRouter.route('/gameSettings', {
    name: 'gameSettings',
    action(params, queryParams) {
        BlazeLayout.render("mainLayout", {main: 'gameSettings'});
    }
});
