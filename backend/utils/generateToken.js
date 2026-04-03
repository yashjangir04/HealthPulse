const jwt = require("jsonwebtoken") ;
const sanitizeUser = require("./sanitizeUser") ;

const generateToken = async (user, role) => {
    const payload = await sanitizeUser(user);
    const token = jwt.sign({...payload , role} , process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
    return token;
}

module.exports = generateToken;