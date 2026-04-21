const User = require("../models/userModel");
const Order = require("../models/ordersModel");
const OrderItem = require("../models/orderItemsModel");
const Payment = require("../models/paymentsModel");
const Product = require("../models/productsModel");


class CombineController{

     async q21(req, res){
        try {
            const data = await Order.aggregate([
                { $group: { _id: "$userId", totalSpent: { $sum: "$totalAmount" } } },
                { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
                { $unwind: "$user" }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }


    async q22(req, res){
        try {
            const data = await Order.aggregate([
                { $group: { _id: "$userId", totalSpent: { $sum: "$totalAmount" } } },
                { $match: { totalSpent: { $gt: 50000 } } },
                { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
                { $unwind: "$user" }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }


    async q23(req, res){
        try {
            const data = await OrderItem.aggregate([
                { $group: { _id: "$productId", totalSold: { $sum: "$quantity" } } },
                { $sort: { totalSold: -1 } },
                { $limit: 10 },
                { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
                { $unwind: "$product" }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }


    async q24(req, res){
        try {
            const data = await OrderItem.aggregate([
                { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "product" } },
                { $unwind: "$product" },
                { $lookup: { from: "orders", localField: "orderId", foreignField: "_id", as: "order" } },
                { $unwind: "$order" },
                { $group: { _id: "$product.category", avgValue: { $avg: "$order.totalAmount" } } }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }


    async q25(req, res){
        try {
            const data = await Order.aggregate([
                { $group: { _id: "$userId", totalRevenue: { $sum: "$totalAmount" } } },
                { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
                { $unwind: "$user" }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }


    async q26(req, res){
        try {
            const data = await Order.aggregate([
                { $group: { _id: "$userId", orderCount: { $sum: 1 } } },
                { $match: { orderCount: { $gt: 3 } } },
                { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
                { $unwind: "$user" }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }


    async q27(req, res){
        try {
            const data = await Order.aggregate([
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, totalRevenue: { $sum: "$totalAmount" } } },
                { $sort: { _id: 1 } }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }


    async q28(req, res){
        try {
            const data = await Payment.aggregate([
                { $match: { status: "paid" } },
                { $group: { _id: "$orderId", totalPaid: { $sum: "$amount" } } },
                { $lookup: { from: "orders", localField: "_id", foreignField: "_id", as: "order" } },
                { $unwind: "$order" }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }


    async q29(req, res){
        try {
            const data = await Product.aggregate([
                { $lookup: { from: "orderitems", localField: "_id", foreignField: "productId", as: "orderItems" } },
                { $match: { orderItems: { $size: 0 } } }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }


    async q30(req, res){
        try {
            const data = await User.aggregate([
                {
                    $facet: {
                        totalUsers: [ { $count: "count" } ],
                        orderStats: [
                            { $lookup: { from: "orders", localField: "_id", foreignField: "userId", as: "orders" } },
                            { $unwind: "$orders" },
                            { $group: { _id: null, totalOrders: { $sum: 1 }, totalRevenue: { $sum: "$orders.totalAmount" } } }
                        ],
                        topUser: [
                            { $lookup: { from: "orders", localField: "_id", foreignField: "userId", as: "orders" } },
                            { $unwind: "$orders" },
                            { $group: { _id: "$_id", name: { $first: "$name" }, email: { $first: "$email" }, totalSpent: { $sum: "$orders.totalAmount" } } },
                            { $sort: { totalSpent: -1 } },
                            { $limit: 1 }
                        ]
                    }
                }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }
}

module.exports = new CombineController();