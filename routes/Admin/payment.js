const express = require('express');
const router = express.Router();
const { getPaymentHistory , getSinglePayment } = require('../../controllers/Admin/payments')
router.get('/', getPaymentHistory)
router.get('/:id', getSinglePayment)
module.exports = router;