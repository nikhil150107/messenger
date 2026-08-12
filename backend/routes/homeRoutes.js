const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/welcome', authMiddleware, (req, res) => {
    res.json({
        message: "welcome to the dashboard"
    })
})

module.exports = router;