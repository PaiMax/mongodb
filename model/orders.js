//const Sequelize=require('sequelize');
//const sequelize=require('../util/database');
//const order =sequelize.define('orders',{
    //id:{
        //type:Sequelize.INTEGER,
        // autoIncrement: true,
//         allowNull:false,
//         primaryKey:true
//     },
//     paymentid:Sequelize.STRING,
//     orderid:Sequelize.STRING,
//     status:Sequelize.STRING
  
// });
// module.exports=order;

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    paymentid: {
        type: String,
        required: true
    },
    orderid: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }

});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

