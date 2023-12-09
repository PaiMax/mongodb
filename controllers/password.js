const Sib=require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
const forgot=require('../model/forgotpassword');
const user=require('../model/user');
const sequelize=require('../util/database');
const path = require('path');
const bcrypt=require('bcrypt');
//const { where } = require('sequelize');
const mongoose=require('mongoose');
let userIdToUpdate=0;


exports.forgotPassword = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const uuid = uuidv4();

        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: 'nishwalbh1997@gmail.com',
        };
        const receivers = [
            {
                email: req.body.email,
            },
        ];

        await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'forgot password',
            textContent: `http://3.88.226.21/password/resetpassword/${uuid}`,
            params: {
                link: uuid,
            },
        });

        const userData = await User.findOne({ email: req.body.email }).select('id').session(session);
        await ForgotPassword.create({ id: uuid, isactive: true, userId: userData.id }, { session });

        await session.commitTransaction();
        session.endSession();

        res.send('successful');
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.log(err);
        res.status(500).send('An error occurred.');
    }
};












exports.resetPassword = async (req, res, next) => {
    try {
        console.log('params=======' + req.body);

        const uuid = req.params.uuid;
        console.log('uuid========' + uuid);

        const request = await forgot.findOne({ id: uuid }).select('isactive userId');

        if (request && request.isactive === true) {
            const filepath = path.join(__dirname, '../views', 'reset.html');
            res.sendFile(filepath);
        } else {
            res.status(404).send('Invalid or expired reset link.');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred.');
    }
};











exports.updatePassword = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const password = req.body.password;
        console.log('password=======' + password);

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                console.log(err);
                await session.abortTransaction();
                session.endSession();
                return res.status(500).send('An error occurred.');
            }

            try {
                await user.updateOne({ _id: userIdToUpdate }, { password: hash }).session(session);
                await forgot.updateOne({ userId: userIdToUpdate }, { isactive: false }).session(session);

                await session.commitTransaction();
                session.endSession();

                res.send('<h2>Your password has been changed</h2>');
            } catch (err) {
                await session.abortTransaction();
                session.endSession();
                console.log(err);
                res.status(500).send('An error occurred.');
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred.');
    }
};

