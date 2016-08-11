FlowRouter.route('/', {
    name: 'main',
    action(params, queryParams) {
        BlazeLayout.render("mainLayout", {main: "homeLayout"});
    }
});

FlowRouter.route('/test', {
    name: 'test',
    action(params, queryParams) {
        BlazeLayout.render("mainLayout", {main: "testLayout"});
    }
});