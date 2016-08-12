FlowRouter.route('/', {
    name: 'index',
    action(params, queryParams) {
    BlazeLayout.render("mainLayout", {main: 'index'});
}
});

FlowRouter.route('/game-settings', {
    name: 'game-settings',
    action(params, queryParams) {
    BlazeLayout.render("mainLayout", {main: 'game-settings'});
}
});