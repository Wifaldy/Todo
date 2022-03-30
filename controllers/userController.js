const { validationResult } = require('express-validator');
const bcrypt = require("bcrypt");
const User = require('../models/userModel');

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