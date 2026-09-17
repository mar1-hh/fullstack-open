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

module.exports = tokenExtractor