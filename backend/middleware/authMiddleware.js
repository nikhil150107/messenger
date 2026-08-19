const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const istoken = authHeader && authHeader.split(" ")[1];

    if (!istoken) {
        return res.status(401).json({
            success: false,
            message: "Token not found, please login again!"
        });
    }

    try {
        const decodedinfo = jwt.verify(istoken, process.env.JWT_SECRET_KEY);
        req.userInfo = decodedinfo;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token, please login again!"
        });
    }
};

module.exports = authMiddleware;