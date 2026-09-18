const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer '))
    return (authorization.replace('Bearer ', ''))
  return null
}

const tokenExtractor = (req, res, next) => {
  const token = getTokenFrom(req)
  if (!token)
    return res.status(401).json({
    error: 'token missing'
  })
  req.token = token
  next()
}

const userExtractor = async (req, res, next) => {
    const token = req.token
    try {
        const decoded_token = jwt.verify(token, process.env.SECRET)
        const user = await User.findById(decoded_token.id)
        if (!user)
            return (res.status(401).json({error: 'user not found'}))
        req.user = user
        next()
    } catch (err)
    {
        return res.status(401).json({error: err.message})
    }
    
}

module.exports = {tokenExtractor, userExtractor}