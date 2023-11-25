const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY
const LOGIN_EXPIRES = process.env.LOGIN_EXPIRES

const signToken = function (user) {

    const payload = {
        id: user._id,
        username: user.username,
        role: user.role
    };
    return jwt.sign(payload, SECRET_KEY,
        { expiresIn: LOGIN_EXPIRES })
}
module.exports = signToken;