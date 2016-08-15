GameSetup = new Mongo.Collection('GameSetup');

export const GameSetupSchema = new SimpleSchema({

    setupOwner: {
        type: String,
        autoValue: function () {
            return this.userId
        }
    },

    isGlobal: {
        type: Boolean,
        defaultValue: false
    },

    title: {
        type: String,
        label: ' '
    },

    gamePassword: {
        type: String,
        optional: true,
        label: ' '
    },

    setup: {
        type: new SimpleSchema({
            initStock: {
                type: Number,
                label: 'Stock'
            },
            initIncomingDelivery: {
                type: Number,
                label: 'Incoming Delivery'
            },
            initIncomingOrder: {
                type: Number,
                label: 'Incoming Order'
            },
            initBackorder: {
                type: Number,
                label: 'Backorder'
            },
            initRoundLengthShippingDelay: { // TODO
                type: Number,
                optional: true,
                label: 'Rounds'
            },
            initAmountShippingDelay: { // TODO
                type: Number,
                optional: true,
                label: 'Amount'
            },
            initInventoryCost: {
                type: Number,
                label: 'Per Unit On Stock'
            },
            initBackorderCost: {
                type: Number,
                label: 'Per Unit On Backorder'
            },
            initMaxRounds: {
                type: Number,
                label: 'Maximum Rounds'
            },
            visibleShippings: {
                type: Boolean,
                defaultValue: false,
                label: 'Visible Shippings'
            },
            visibleDemands: {
                type: Boolean,
                defaultValue: false,
                label: 'Visible Demands'
            },
            allowMessaging: {
                type: Boolean,
                defaultValue: false,
                label: 'Allow Messaging'
            },
            initDemand: {
                type: [ new SimpleSchema({
                    roundNumber: {
                        type: Number
                    },
                    demand: {
                        type: Number
                    }
                }) ],
                label: 'Demand'
            }
        })
    }
});

GameSetup.attachSchema(GameSetupSchema);
