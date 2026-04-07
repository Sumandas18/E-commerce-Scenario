require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./app/models/userModel');
const Product = require('./app/models/productsModel');
const Order = require('./app/models/ordersModel');
const OrderItem = require('./app/models/orderItemsModel');
const Payment = require('./app/models/paymentsModel');

const dbConfig = require('./app/config/dbConfig');

const seedData = async () => {
    await dbConfig();

    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await OrderItem.deleteMany({});
    await Payment.deleteMany({});

    console.log("Inserting new products...");
    const productsToEnter = [
        { name: "OnePlus 12", category: "Electronics", price: 65000, stock: 60 },
        { name: "Realme Narzo 70", category: "Electronics", price: 18000, stock: 100 },
        { name: "Dell XPS 13", category: "Laptops", price: 110000, stock: 25 },
        { name: "HP Pavilion Gaming", category: "Laptops", price: 75000, stock: 35 },
        { name: "Boat Rockerz 550", category: "Accessories", price: 2500, stock: 200 },
        { name: "Noise Smartwatch X", category: "Accessories", price: 4000, stock: 150 },
        { name: "Samsung 55\" 4K TV", category: "Electronics", price: 60000, stock: 20 },
        { name: "Mi Air Purifier", category: "Home Appliances", price: 12000, stock: 50 },
    ];

    console.log("Inserting new users...");
    const usersToEnter = [
        { name: "Rahul Sharma", email: "rahul@gmail.com", city: "Kolkata" },
        { name: "Ananya Das", email: "ananya@gmail.com", city: "Delhi" },
        { name: "Sourav Roy", email: "sourav@gmail.com", city: "Mumbai" },
        { name: "Priya Singh", email: "priya@gmail.com", city: "Bangalore" },
        { name: "Arjun Patel", email: "arjun@gmail.com", city: "Ahmedabad" },
        { name: "Neha Verma", email: "neha@gmail.com", city: "Pune" },
    ];

    const insertedProducts = await Product.insertMany(productsToEnter);
    const insertedUsers = await User.insertMany(usersToEnter);

    console.log("Creating orders, order items and payments...");

    const statuses = ["pending", "completed", "cancelled"];
    const paymentMethods = ["UPI", "Credit Card", "Debit Card", "Net Banking"];

    for (let i = 0; i < 8; i++) {
        const user = insertedUsers[Math.floor(Math.random() * insertedUsers.length)];

        const product1 = insertedProducts[Math.floor(Math.random() * insertedProducts.length)];
        const product2 = insertedProducts[Math.floor(Math.random() * insertedProducts.length)];

        const qty1 = Math.floor(Math.random() * 3) + 1;
        const qty2 = Math.floor(Math.random() * 2) + 1;

        const orderStatus = statuses[Math.floor(Math.random() * statuses.length)];

        const totalAmount = (product1.price * qty1) + (product2.price * qty2);

        const order = new Order({
            userId: user._id,
            totalAmount,
            status: orderStatus
        });

        await order.save();

        const orderItems = [
            {
                orderId: order._id,
                productId: product1._id,
                quantity: qty1,
                price: product1.price
            },
            {
                orderId: order._id,
                productId: product2._id,
                quantity: qty2,
                price: product2.price
            }
        ];

        await OrderItem.insertMany(orderItems);

        const payment = new Payment({
            orderId: order._id,
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            amount: totalAmount,
            status:
                orderStatus === 'completed'
                    ? 'paid'
                    : orderStatus === 'pending'
                    ? 'pending'
                    : 'failed'
        });

        await payment.save();
    }

    console.log("Data seeded successfully with new dataset");
    process.exit(0);
};

seedData().catch(err => {
    console.error("Error seeding data:", err);
    process.exit(1);
});