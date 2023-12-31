const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const outHeader = req.headers['authorization'];
    const token = outHeader && outHeader.split(' ')[1]

    if(token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403)
        req.email = decoded.email
        next()
    })
}

module.exports = verifyToken