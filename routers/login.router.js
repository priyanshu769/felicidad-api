const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()
const secretKey = process.env.SECRET

// Model
const {User} = require('../models/user.model')

router.route('/').post(async(req, res)=> {
    const {username, password} = req.body
    try{
        const loginUser = await User.findOne({username: username})
        if (loginUser){
            const isPasswordCorrect = await bcrypt.compare(password, loginUser.password)
            if (isPasswordCorrect){
                const token = jwt.sign({userId: loginUser._id}, secretKey)
                const {password, __v, ...restUserData} = loginUser._doc
                return res.json({success: true, loginUser: restUserData, token})
            }
            else res.json({success: false, message: "Incorrect Password."})
        }
        else res.json({success: false, message: "No user found with this username."})
    }catch(error){
        res.json({success: false, message: "Unable to login, some error occured.", errorMessage: error.message})
    }
})

module.exports = router