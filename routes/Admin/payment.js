const express = require('express');
const router = express.Router();
const { getPaymentHistory } = require('../../controllers/Admin/payments')
router.get('/', getPaymentHistory)
module.exports = router;