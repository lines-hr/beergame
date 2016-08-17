//TODO staviti min ili max atribute za odredena polja - dogovoriti koje i koliko

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
        label: ' ',
        unique: true
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
                label: 'Stock',
                min: 0
            },
            initIncomingDelivery: {
                type: Number,
                label: 'Incoming Delivery',
                min: 0
            },
            initIncomingOrder: {
                type: Number,
                label: 'Incoming Order',
                min: 0
            },
            initBackorder: {
                type: Number,
                label: 'Backorder',
                min: 0
            },
            initRoundLengthShippingDelay: {
                type: Number,
                optional: true,
                label: 'Rounds',
                min: 0
            },
            initAmountShippingDelay: {
                type: Number,
                optional: true,
                label: 'Amount',
                min: 0
            },
            initInventoryCost: {
                type: Number,
                label: 'Per Unit On Stock',
                min: 0.1
            },
            initBackorderCost: {
                type: Number,
                label: 'Per Unit On Backorder',
                min: 0.2
            },
            initMaxRounds: {
                type: Number,
                label: 'Maximum Rounds',
                min: 5
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
                label: 'Demand',
                min: 3
            }
        })
    }
});

GameSetup.attachSchema(GameSetupSchema);
