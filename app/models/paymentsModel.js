
const mongoose = require('mongoose')
const Schema = mongoose.Schema  
const paymentSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },  
    paymentMethod: {
        type: String,
        enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking'],
        required: true,
        default: 'UPI'
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    paidAt: {
        type: Date
    }
},{timestamps: true, versionKey: false})        

const paymentModel = mongoose.model('Payment', paymentSchema)

module.exports = paymentModel