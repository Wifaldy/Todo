const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/userModel');
const userController = require('../controllers/userController');


const router = Router();

router.put('/signup', [
    body('name').isLength({ min: 5 }).trim().withMessage('Please enter a name with at least 5 characters'),
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(async(email, { req }) => {
        const user = await User.findOne({ where: { email: email } })
        if (user) {
            throw new Error('Email already in use')
        }
        return true;
    }).normalizeEmail(),
    body('password').isLength({ min: 5 }).trim().withMessage('Please enter a password with at least 5 characters'),
    body('confirmPassword').custom((password, { req }) => {
        if (password !== req.body.password) {
            throw new Error('Passwords do not match')
        }
        return true;
    })
], userController.putSignUp);

router.post("/login", userController.postLogin);

module.exports = router;