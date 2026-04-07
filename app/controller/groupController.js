const User = require("../models/userModel");
const Order = require("../models/ordersModel");
const OrderItem = require("../models/orderItemsModel");

class GroupController{
        // 👉 11. Calculate total revenue from all orders.
        async q11(req, res){
            try {
                const data = await Order.aggregate([
                    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
                ]);
                res.status(200).json({success: true, data});
            } catch (error) { res.status(500).json({success: false, message: error.message}); }
        }
    
        // 👉 12. Count total number of orders per user.
        async q12(req, res){
            try {
                const data = await Order.aggregate([
                    { $group: { _id: "$userId", totalOrders: { $sum: 1 } } }
                ]);
                res.status(200).json({success: true, data});
            } catch (error) { res.status(500).json({success: false, message: error.message}); }
        }
    
        // 👉 13. Find average order value per user.
        async q13(req, res){
            try {
                const data = await Order.aggregate([
                    { $group: { _id: "$userId", avgOrderValue: { $avg: "$totalAmount" } } }
                ]);
                res.status(200).json({success: true, data});
            } catch (error) { res.status(500).json({success: false, message: error.message}); }
        }
    
        // 👉 14. Get maximum order amount.
        async q14(req, res){
            try {
                const data = await Order.aggregate([
                    { $group: { _id: null, maxAmount: { $max: "$totalAmount" } } }
                ]);
                res.status(200).json({success: true, data});
            } catch (error) { res.status(500).json({success: false, message: error.message}); }
        }
    
        // 👉 15. Group orders by status and count them.
        async q15(req, res){
            try {
                const data = await Order.aggregate([
                    { $group: { _id: "$status", count: { $sum: 1 } } }
                ]);
                res.status(200).json({success: true, data});
            } catch (error) { res.status(500).json({success: false, message: error.message}); }
        }
    
        // 👉 16. Calculate monthly revenue.
        async q16(req, res){
            try {
                const data = await Order.aggregate([
                    { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, totalRevenue: { $sum: "$totalAmount" } } },
                    { $sort: { "_id.year": 1, "_id.month": 1 } }
                ]);
                res.status(200).json({success: true, data});
            } catch (error) { res.status(500).json({success: false, message: error.message}); }
        }
    
        // 👉 17. Find top 5 users based on total spending.
        async q17(req, res){
            try {
                const data = await Order.aggregate([
                    { $group: { _id: "$userId", totalSpent: { $sum: "$totalAmount" } } },
                    { $sort: { totalSpent: -1 } },
                    { $limit: 5 },
                    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
                    { $unwind: "$user" }
                ]);
                res.status(200).json({success: true, data});
            } catch (error) { res.status(500).json({success: false, message: error.message}); }
        }
    
        // 👉 18. Count products sold per category.
        async q18(req, res){
            try {
                const data = await OrderItem.aggregate([
                    { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "product" } },
                    { $unwind: "$product" },
                    { $group: { _id: "$product.category", count: { $sum: "$quantity" } } }
                ]);
                res.status(200).json({success: true, data});
            } catch (error) { res.status(500).json({success: false, message: error.message}); }
        }
    
        // 👉 19. Find duplicate users based on email.
        async q19(req, res){
            try {
                const data = await User.aggregate([
                    { $group: { _id: "$email", count: { $sum: 1 }, users: { $push: "$_id" } } },
                    { $match: { count: { $gt: 1 } } }
                ]);
                res.status(200).json({success: true, data});
            } catch (error) { res.status(500).json({success: false, message: error.message}); }
        }
    
        // 👉 20. Get total quantity sold per product.
        async q20(req, res){
            try {
                const data = await OrderItem.aggregate([
                    { $group: { _id: "$productId", totalQuantity: { $sum: "$quantity" } } },
                    { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
                    { $unwind: "$product" }
                ]);
                res.status(200).json({success: true, data});
            } catch (error) { res.status(500).json({success: false, message: error.message}); }
        }
}

module.exports = new GroupController();