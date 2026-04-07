const User = require("../models/userModel");
const Order = require("../models/ordersModel");


class LookUpController{
    // 👉 1. Fetch all users with their orders.
    async q1(req, res){
        try {
            const data = await User.aggregate([
                { $lookup: { from: "orders", localField: "_id", foreignField: "userId", as: "orders" } }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }

    // 👉 2. Get all orders with user details (name, email).
    async q2(req, res){
        try {
            const data = await Order.aggregate([
                { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }

    // 👉 3. Find users who have placed at least one order.
    async q3(req, res){
        try {
            const data = await User.aggregate([
                { $lookup: { from: "orders", localField: "_id", foreignField: "userId", as: "orders" } },
                { $match: { orders: { $ne: [] } } }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }

    // 👉 4. Find users who have never placed any order.
    async q4(req, res){
        try {
            const data = await User.aggregate([
                { $lookup: { from: "orders", localField: "_id", foreignField: "userId", as: "orders" } },
                { $match: { orders: { $size: 0 } } }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }

    // 👉 5. Fetch orders along with their order items.
    async q5(req, res){
        try {
            const data = await Order.aggregate([
                { $lookup: { from: "orderitems", localField: "_id", foreignField: "orderId", as: "orderItems" } }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }

    // 👉 6. Get order details with product information.
    async q6(req, res){
        try {
            const data = await Order.aggregate([
                { $lookup: { from: "orderitems", localField: "_id", foreignField: "orderId", pipeline: [ { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "product" } }, { $unwind: "$product" } ], as: "items" } }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }

    // 👉 7. Fetch full order summary: user info, products, total amount.
    async q7(req, res){
        try {
            const data = await Order.aggregate([
                { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
                { $unwind: "$user" },
                { $lookup: { from: "orderitems", localField: "_id", foreignField: "orderId", pipeline: [ { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "product" } }, { $unwind: "$product" } ], as: "products" } }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }

    // 👉 8. Join orders with payments and show payment status.
    async q8(req, res){
        try {
            const data = await Order.aggregate([
                { $lookup: { from: "payments", localField: "_id", foreignField: "orderId", as: "payment" } },
                { $unwind: { path: "$payment", preserveNullAndEmptyArrays: true } }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }

    // 👉 9. Find orders where payment is not completed.
    async q9(req, res){
        try {
            const data = await Order.aggregate([
                { $lookup: { from: "payments", localField: "_id", foreignField: "orderId", as: "payment" } },
                { $unwind: "$payment" },
                { $match: { "payment.status": { $ne: "paid" } } }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }

    // 👉 10. Fetch users with their latest order only.
    async q10(req, res){
        try {
            const data = await User.aggregate([
                { $lookup: { from: "orders", localField: "_id", foreignField: "userId", pipeline: [ { $sort: { createdAt: -1 } }, { $limit: 1 } ], as: "latestOrder" } }
            ]);
            res.status(200).json({success: true, data});
        } catch (error) { res.status(500).json({success: false, message: error.message}); }
    }



    // 👉 21. Join users and orders → calculate total spending per user.
   
}

module.exports = new LookUpController();