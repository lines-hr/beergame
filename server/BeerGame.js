BeerGame = {

    startGame (gameId) {
        var game = Game.findOne({_id: gameId});
        if (game && Meteor.userId() == game.gameAdmin) {
            this.setInitialRound(game);
        }
    },

    setInitialRound(game){

        const customerDemand = _.find(game.__initDemand, function (d) {
            return d.roundNumber == 1
        }).demand;

        const paramChainFactory = {
            lastInventory: game.gameSetup.initStock,
            lastBackOrder: game.gameSetup.initBackorder,
            incomingDelivery: game.gameSetup.initIncomingDelivery,
            incomingOrder: game.gameSetup.initIncomingOrder,
            backorderCost: game.gameSetup.initBackorderCost,
            inventoryCost: game.gameSetup.initInventoryCost,
            lastCostSum: 0,
            lastMyOrdersSum: 0,
            lastOrder: game.gameSetup.initIncomingOrder + game.gameSetup.initBackorder,
            lastSumIncomingDelivery: 0,
            lastIncomingDelivery: 0,
            upperBackorderAndDelivery: 0
        };

        const paramChainOthers = {
            lastInventory: game.gameSetup.initStock,
            lastBackOrder: game.gameSetup.initBackorder,
            incomingDelivery: game.gameSetup.initIncomingDelivery,
            incomingOrder: game.gameSetup.initIncomingOrder,
            backorderCost: game.gameSetup.initBackorderCost,
            inventoryCost: game.gameSetup.initInventoryCost,
            lastCostSum: 0,
            lastMyOrdersSum: 0,
            lastOrder: game.gameSetup.initIncomingOrder + game.gameSetup.initBackorder,
            lastSumIncomingDelivery: 0,
            lastIncomingDelivery: 0,
            upperBackorderAndDelivery: this.calculate.backorder(
                this.calculate.toShip(0, game.gameSetup.initIncomingOrder),
                    this.calculate.outgoingDelivery(
                        this.calculate.toShip(0, game.gameSetup.initIncomingOrder),
                        this.calculate.stockAvailable(game.gameSetup.initStock, game.gameSetup.initIncomingDelivery)
                ) + this.calculate.outgoingDelivery(
                        this.calculate.toShip(0, game.gameSetup.initIncomingOrder),
                        this.calculate.stockAvailable(game.gameSetup.initStock, game.gameSetup.initIncomingDelivery)
                )
            )
        };

        const paramChainRetailer = {
            lastInventory: game.gameSetup.initStock,
            lastBackOrder: game.gameSetup.initBackorder,
            incomingDelivery: game.gameSetup.initIncomingDelivery,
            incomingOrder: customerDemand,
            backorderCost: game.gameSetup.initBackorderCost,
            inventoryCost: game.gameSetup.initInventoryCost,
            lastCostSum: 0,
            lastMyOrdersSum: 0,
            lastOrder: game.gameSetup.initIncomingOrder + game.gameSetup.initBackorder,
            lastSumIncomingDelivery: 0,
            lastIncomingDelivery: 0,
            upperBackorderAndDelivery: this.calculate.backorder(
                this.calculate.toShip(0, game.gameSetup.initIncomingOrder),
                this.calculate.outgoingDelivery(
                    this.calculate.toShip(0, game.gameSetup.initIncomingOrder),
                    this.calculate.stockAvailable(game.gameSetup.initStock, game.gameSetup.initIncomingDelivery)
                ) + this.calculate.outgoingDelivery(
                    this.calculate.toShip(0, game.gameSetup.initIncomingOrder),
                    this.calculate.stockAvailable(game.gameSetup.initStock, game.gameSetup.initIncomingDelivery)
                )
            )
        };

        var othersData = this.calculate.round(paramChainOthers);
        var retailerData = this.calculate.round(paramChainRetailer);
        var factoryData = this.calculate.round(paramChainFactory);

        const gameRound = {
            gameId: game._id,
            gameRound: 1,
            dataRetailer: retailerData,
            dataWholesaler: othersData,
            dataDistributor: othersData,
            dataFactory: factoryData,
        };

        if (GameRound.insert(gameRound)) {
            Game.update({_id: game._id}, {$set: {currentRound: 1}});
        }


    },

    setOrder (gameId, order){
        if (Meteor.userId()) {
            var game = Game.findOne({_id: gameId});
            if (game) {
                var player = _.find(game.players, function (p) {
                    return Meteor.userId() === p.playerId;
                });
                if (player) {

                    switch (player.position) {
                        case "Retailer" :
                            GameRound.update({
                                gameId: game._id,
                                gameRound: game.currentRound
                            }, {$set: {"dataRetailer.myOrder": order}});
                            break;
                        case "Wholesaler" :
                            GameRound.update({
                                gameId: game._id,
                                gameRound: game.currentRound
                            }, {$set: {"dataWholesaler.myOrder": order}});
                            break;
                        case "Distributor" :
                            GameRound.update({
                                gameId: game._id,
                                gameRound: game.currentRound
                            }, {$set: {"dataDistributor.myOrder": order}});
                            break;
                        case "Factory" :
                            GameRound.update({
                                gameId: game._id,
                                gameRound: game.currentRound
                            }, {$set: {"dataFactory.myOrder": order}});
                            break;
                    }
                    var gameRound = this.getRound(game._id, game.currentRound);

                    if (this.allPlayed(gameRound)) {
                        if (game.currentRound < game.numRounds) {
                            this.nextRoundSetup(game, gameRound);
                            this.increaseRound(game._id);
                        } else {
                            Game.update({_id: game._id}, {$set: {status: "finished"}});
                        }
                    }

                } else {
                    console.log("User" + Meteor.userId() + "trying to hax us!");
                }
            }
        } else {
            console.log("Unknown user trying to hax us!");
        }
    },

    getRound (gameId, roundNumber) {
        var gameRound = GameRound.findOne({gameId: gameId, gameRound: roundNumber});
        if (gameRound) return gameRound;
    },

    nextRoundSetup (game, currentRound){

        const customerDemand = _.find(game.__initDemand, function (d) {
            return d.roundNumber == currentRound.gameRound + 1
        }).demand;

        var factoryUpper;
        if (currentRound.gameRound > 1)
            factoryUpper = this.getRound(game._id, currentRound.gameRound - 1).dataFactory.myOrder;
        else
            factoryUpper = 0;


        const paramRetailer = {
            lastInventory: currentRound.dataRetailer.inventory,
            lastBackOrder: currentRound.dataRetailer.backorder,
            incomingDelivery: currentRound.dataWholesaler.outgoingDelivery,
            incomingOrder: customerDemand,
            backorderCost: game.gameSetup.initBackorderCost,
            inventoryCost: game.gameSetup.initInventoryCost,
            lastCostSum: currentRound.dataRetailer.costSum,
            lastMyOrdersSum: currentRound.dataRetailer.__sumMyOrders,
            lastOrder: currentRound.dataRetailer.myOrder,
            lastSumIncomingDelivery: currentRound.dataRetailer.__sumIncomingDelivery,
            lastIncomingDelivery: currentRound.dataRetailer.incomingDelivery,
            upperBackorderAndDelivery: currentRound.dataWholesaler.backorder + currentRound.dataWholesaler.outgoingDelivery
        };

        const paramWholesaler = {
            lastInventory: currentRound.dataWholesaler.inventory,
            lastBackOrder: currentRound.dataWholesaler.backorder,
            incomingDelivery: currentRound.dataDistributor.outgoingDelivery,
            incomingOrder: currentRound.dataRetailer.myOrder,
            backorderCost: game.gameSetup.initBackorderCost,
            inventoryCost: game.gameSetup.initInventoryCost,
            lastCostSum: currentRound.dataWholesaler.costSum,
            lastMyOrdersSum: currentRound.dataWholesaler.__sumMyOrders,
            lastOrder: currentRound.dataWholesaler.myOrder,
            lastSumIncomingDelivery: currentRound.dataWholesaler.__sumIncomingDelivery,
            lastIncomingDelivery: currentRound.dataWholesaler.incomingDelivery,
            upperBackorderAndDelivery: currentRound.dataDistributor.backorder + currentRound.dataWholesaler.outgoingDelivery
        };

        const paramDistributor = {
            lastInventory: currentRound.dataDistributor.inventory,
            lastBackOrder: currentRound.dataDistributor.backorder,
            incomingDelivery: currentRound.dataFactory.outgoingDelivery,
            incomingOrder: currentRound.dataWholesaler.myOrder,
            backorderCost: game.gameSetup.initBackorderCost,
            inventoryCost: game.gameSetup.initInventoryCost,
            lastCostSum: currentRound.dataDistributor.costSum,
            lastMyOrdersSum: currentRound.dataDistributor.__sumMyOrders,
            lastOrder: currentRound.dataDistributor.myOrder,
            lastSumIncomingDelivery: currentRound.dataDistributor.__sumIncomingDelivery,
            lastIncomingDelivery: currentRound.dataDistributor.incomingDelivery,
            upperBackorderAndDelivery: currentRound.dataFactory.backorder + currentRound.dataWholesaler.outgoingDelivery
        };

        const paramFactory = {
            lastInventory: currentRound.dataFactory.inventory,
            lastBackOrder: currentRound.dataFactory.backorder,
            incomingDelivery: factoryUpper,
            incomingOrder: currentRound.dataDistributor.myOrder,
            backorderCost: game.gameSetup.initBackorderCost,
            inventoryCost: game.gameSetup.initInventoryCost,
            lastCostSum: currentRound.dataFactory.costSum,
            lastMyOrdersSum: currentRound.dataFactory.__sumMyOrders,
            lastOrder: currentRound.dataFactory.myOrder,
            lastSumIncomingDelivery: currentRound.dataFactory.__sumIncomingDelivery,
            lastIncomingDelivery: currentRound.dataFactory.incomingDelivery,
            upperBackorderAndDelivery: currentRound.dataFactory.myOrder
        };

        var newRetailerData = this.calculate.round(paramRetailer);
        var newWholesalerData = this.calculate.round(paramWholesaler);
        var newDistributorData = this.calculate.round(paramDistributor);
        var newFactoryData = this.calculate.round(paramFactory);

        const nextGameRound = {
            gameId: game._id,
            gameRound: currentRound.gameRound + 1,
            dataRetailer: newRetailerData,
            dataWholesaler: newWholesalerData,
            dataDistributor: newDistributorData,
            dataFactory: newFactoryData,
        };

        return GameRound.insert(nextGameRound);

    },

    allPlayed (gameRound){
        var r = typeof gameRound.dataRetailer.myOrder !== "undefined";
        var w = typeof gameRound.dataWholesaler.myOrder !== "undefined";
        var d = typeof gameRound.dataDistributor.myOrder !== "undefined";
        var f = typeof gameRound.dataFactory.myOrder !== "undefined";
        return r && w && d && f;
    },

    increaseRound (gameId) {
        return Game.update({_id: gameId}, {$inc: {"currentRound": 1}});
    },

    calculate: {

        stockAvailable (lastInventory, incomingDelivery) {
            return lastInventory + incomingDelivery;
        },

        toShip (lastBackOrder, incomingOrder) {
            return lastBackOrder + incomingOrder;
        },

        outgoingDelivery (toShip, stockAvailable) {
            return ( toShip <= stockAvailable ) ? toShip : stockAvailable;
        },

        backorder (toShip, outgoingDelivery) {
            return toShip - outgoingDelivery;
        },

        inventory (stockAvailable, outgoingDelivery) {
            return stockAvailable - outgoingDelivery;
        },

        costRound (backorder, backorderCost, inventory, inventoryCost){
            return backorder * backorderCost + inventory * inventoryCost
        },

        costSum (lastCostSum, costRound) {
            return lastCostSum + costRound;
        },

        sumMyOrders (lastMyOrdersSum, lastOrder){
            return lastMyOrdersSum + lastOrder;
        },

        sumIncomingDelivery (lastSumIncomingDelivery, lastIncomingDelivery){
            return lastSumIncomingDelivery + lastIncomingDelivery;
        },

        pendingDelivery (sumMyOrders, sumIncomingDelivery){
            return sumMyOrders - sumIncomingDelivery;
        },

        round(params) {
            /*
             REQUIRED PARAMS:

             params.lastInventory,
             params.lastBackOrder,
             params.incomingDelivery,
             params.incomingOrder,
             params.backorderCost,
             params.inventoryCost,
             params.lastCostSum,
             params.lastMyOrdersSum,
             params.lastOrder,
             params.lastSumIncomingDelivery,
             params.lastIncomingDelivery
             params.upperBackorderAndDelivery

             */

            var stockAvailable = this.stockAvailable(params.lastInventory, params.incomingDelivery);
            var toShip = this.toShip(params.lastBackOrder, params.incomingOrder);
            var outgoingDelivery = this.outgoingDelivery(toShip, stockAvailable);
            var backorder = this.backorder(toShip, outgoingDelivery);
            var inventory = this.inventory(stockAvailable, outgoingDelivery);
            var costRound = this.costRound(backorder, params.backorderCost, inventory, params.inventoryCost);
            var costSum = this.costSum(params.lastCostSum, costRound);
            var sumMyOrders = this.sumMyOrders(params.lastMyOrdersSum, params.lastOrder);
            var sumIncomingDelivery = this.sumIncomingDelivery(params.lastSumIncomingDelivery, params.lastIncomingDelivery);
            //var pendingDelivery = this.pendingDelivery(sumMyOrders, sumIncomingDelivery);

            const roundCalculations = {
                incomingDelivery: params.incomingDelivery,
                pendingDelivery: params.upperBackorderAndDelivery,
                stockAvailable: stockAvailable,
                incomingOrder: params.incomingOrder,
                __toShip: toShip,
                outgoingDelivery: outgoingDelivery,
                backorder: backorder,
                inventory: inventory,
                costRound: costRound,
                costSum: costSum,
                __sumIncomingDelivery: sumIncomingDelivery,
                __sumMyOrders: sumMyOrders
            };

            return roundCalculations;

        }


    },


};