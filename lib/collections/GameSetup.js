GameSetup = new Mongo.Collection("GameSetup");

export const GameSetupSchema = new SimpleSchema({

    setupOwner: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },

    isGlobal: {
        type: Boolean,
        defaultValue: false
    },

    title: {
        type: String
    },

    setup: {
        type: new SimpleSchema({
            initStock: {
                type: Number
            },
            initIncomingDelivery: {
                type: Number
            },
            initIncomingOrder: {
                type: Number
            },
            initBackorder: {
                type: Number
            },
            initRoundLengthShippingDelay: { // TODO
                type: Number,
                optional: true
            },
            initAmountShippingDelay: { // TODO
                type: Number,
                optional: true
            },
            initInventoryCost: {
                type: Number
            },
            initBackorderCost: {
                type: Number
            },
            initMaxRounds: {
                type: Number
            },

            initDemand: {
                type: new SimpleSchema({
                    roundNumber: {
                        type: Number
                    },
                    demand: {
                        type: Number
                    }
                })
            },
            visibleShippings: {
                type: Boolean,
                defaultValue: false
            },
            visibleDemands: {
                type: Boolean,
                defaultValue: false
            },
            allowMessaging: {
                type: Boolean,
                defaultValue: false
            }

        })
    }
});

GameSetup.attachSchema(GameSetupSchema);
