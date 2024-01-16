const express = require('express');
const router = express();
const {s_authenticate} = require('../../middlewares/staffAuth');
router.get('/test', s_authenticate, (req, res) => {
    const staff = req.staff;
    res.render('test', { staff });
})

module.exports = router;