const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require('../models/userModel');
require("dotenv").config();

exports.putSignUp = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
        const hashedPw = await bcrypt.hash(password, 12);
        const user = await User.create({
            name: name,
            email: email,
            password: hashedPw
        })
        await user.save();
        res.status(201).json({ message: "User created", userId: user.id })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postLogin = async(req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error("Wrong password");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
                email: user.email,
                userId: user.id
            },
            process.env.JWT_SECRET, {
                expiresIn: "1h"
            });
        res.status(200).json({
            token: token,
            userId: user.id
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}