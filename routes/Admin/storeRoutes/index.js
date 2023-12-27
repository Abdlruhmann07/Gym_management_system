const express = require('express');
const router = express.Router();
const productRoutes = require('../storeRoutes/productRoutes');
router.use('/products' , productRoutes)

module.exports = router