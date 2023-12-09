const Razorpay=require('razorpay');
const  Order=require('../model/orders');

 

const User = require('../models/user'); 

exports.purchasePremium = async (req, res, next) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        
        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                console.log('in rzp.orders.create');
                return res.status(500).json({ message: 'Something went wrong', error: err });
            }

            try {
                const newOrder = new Order({
                    orderid: order.id,
                    status: 'PENDING',
                    userId: req.user.id
                });
                await newOrder.save();

                return res.status(201).json({ order, key_id: rzp.key_id });
            } catch (err) {
                console.log(err);
                return res.status(500).json({ message: 'Something went wrong', error: err });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err });
    }
};




exports.updateTransaction = async (req, res) => {
    try {
        console.log('payment id==================' + req.body.payment_id);

        const updatedTransaction = await Order.findOneAndUpdate(
            { userId: req.user.id },
            { paymentid: req.body.payment_id, status: 'SUCCESS' },
            { new: true } // Set 'new' to true to get the updated document
        );

        console.log(updatedTransaction);

        await User.findByIdAndUpdate(
            req.user.id,
            { ispremiumuser: true },
            { new: true } // Again, set 'new' to true to get the updated document
        );

        return res.status(202).json({
            success: true,
            message: "Transaction Successful",
            user: { ispremiumuser: true }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};
