const User = require('../models/user')
const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

userRouter.get('/', async (req, res) => {
    const Users = await User.find().populate('blogs', {url: 1, title: 1, author: 1, id: 1})
    res.status(200).json(Users)
})

userRouter.delete('/', async (req, res) => {
    const Users = await User.deleteMany()
    res.status(200).end()
})

userRouter.post('/register', async (req, res, next) => {
    const {username, name, password} = req.body
    
    if (!password || password.length < 3)
        return (res.status(400).json({error: 'password must be at least 3 characters long'}))
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const newUser = new User({
        username,
        name,
        passwordHash
    })
    try{
        const user = await newUser.save()
        res.status(201).json(user)
    } catch (err) {
        next(err)
    }
})

userRouter.post('/login', async (req, res, next) => {
    const {username, password} = req.body
    if (!password || password.length < 3)
        return (res.status(400).json({error: 'password must be at least 3 characters long'}))
    const user = await User.findOne({username})
    const isCorrect = (user === null ? false : await bcrypt.compare(password, user.passwordHash))
    if (!user || !isCorrect)
        return res.status(401).json({
      error: 'invalid username or password'
    })
    const userToken = {
        username,
        id: user._id
    }
    const token = jwt.sign(userToken, process.env.SECRET)
    res.status(200).json({token, username: user.username, name: user.name, id: user.id})
})

module.exports = userRouter