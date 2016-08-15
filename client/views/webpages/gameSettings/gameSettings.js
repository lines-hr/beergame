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
});

Template.gameSettings.onRendered(function () {
});

Template.gameSettings.events({
    'click #goRoomBtn': function(e) {
        e.preventDefault();

        FlowRouter.go('/room');
    }
});

AutoForm.addHooks('insertGameSettingsForm', {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
/*        console.log(arguments);
        return false;*/
    },
    onError: function (name, error, template) {
        console.log(name + " error:", error);
    },
/*    formToDoc: function (doc) {
        demandSetup = doc.setup.initDemand;
        if(demandSetup)
            updateChart(demandSetup);
    }*/
});

AutoForm.addHooks(null, {
    onError: function (name, error, template) {
        console.log(name + " error:", error);
    }
});

/*
Template.gameSettings.events({
    'submit #insertGameSettingsForm'(e) {
        e.preventDefault();
        const t = e.target;
        const title = t.value;

        const mirko = AutoForm.getFormValues('insertGameSettingsForm');
        console.log(mirko);

});
*/

SimpleSchema.debug = true;