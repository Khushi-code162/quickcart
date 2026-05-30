const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    items :[{
        product: {type:mongoose.Schema.ObjectId, ref:'Product'},
        quantity:Number,
        PriceAtOrder:Number
    }],
    totalAmount:{
        type:Number,
        required:true
    },
    status:{
        type: String,
        enum :['PENDING', 'CONFIRMED' ,'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING'
    },
    statusHistory:[{
        status:String,
        ChangedAt:{type : Date, default:Date.now},
        note:String
    }],
    shippingAddress:{
        street:String,
        city:String,
        pincode:String,
        state:String,
    },
    paymentStatus:{
        type:String,
        enum:['PAID','UNPAID','REFUNDED'],
        default : 'UNPAID'
    }
},{timestamps: true});

module.exports = mongoose.model("Order", orderSchema);