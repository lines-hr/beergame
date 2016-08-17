//meteor npm install --save chart
/*
var Chart = require("chart");

function updateChart(d) {

    var chartData = new Array({x: 0, y: 0});
    $.each(d, function (index, value) {
        if (!value.roundNumber || !value.demand) return false;
        chartData.push({x: value.roundNumber, y: value.demand});
    });
    scatterChart = new Chart($("#demandChart"), {
        type: 'line',
        data: {
            datasets: [{
                label: 'Demand',
                data: chartData,
                lineTension: 0,
                fill: false,
                borderColor: "#F00"
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Game Rounds'
                    },
                    ticks: {
                        min: 0,
                        stepSize: 1
                    }
                }],
                yAxes: [{
                    type: 'linear',
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Demand'
                    },
                    ticks: {
                        min: 0
                    }
                }]
            }
        }
    });
}
*/

Template.gameSettings.onCreated(function () {
    Meteor.subscribe("GameSetup");
    Meteor.subscribe("Game");

    Session.set('disabledCheckbox', null);
});

Template.gameSettings.onRendered(function () {
});

Template.gameSettings.events({
    'click #shippingDelayBtn': function(e, t) {
        var disable = event.target.checked;

        if(disable) {
            Session.set('disabledCheckbox', 'disabled');
        } else {
            Session.set('disabledCheckbox', null);
        }
    },

    'input #maxRoundsValidation': function (event, template) {
        Session.set("maxRoundValidate", event.currentTarget.value);
    }
});

Template.gameSettings.helpers({
    isDisabled: function() {
        return Session.get('disabledCheckbox') === null;
    },

    getMaxRounds: function() {
        return Session.get('maxRoundValidate');
    }

});

AutoForm.addHooks('insertGameSettingsForm', {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        /*
        console.log(arguments);
        return false;
        */
    },

    onError: function (name, error, template) {
        console.log(name + " error:", error);
    },
    /*
    formToDoc: function (doc) {
        demandSetup = doc.setup.initDemand;
        if(demandSetup)
            updateChart(demandSetup);
    },
    */
    onSuccess: function(formType, result) {
        Game.insert({
            gameSetup: this.docId,
            gameAdmins: this.userId,
            gameStatus: 'inLobby'
        });

        Session.set("userGameSettings", this.docId);
        FlowRouter.go('/room');
    }
});

AutoForm.addHooks(null, {
    onError: function (name, error, template) {
        console.log(name + " error:", error);
    }
});

Template.gameSettings.destroyed = function(){
    Session.set('disabledCheckbox', null);
};

SimpleSchema.debug = true;