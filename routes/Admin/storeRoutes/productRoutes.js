const express = require('express');
const router = express.Router();

const {
    addProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
} = require('../../../controllers/Admin/store/productController');

router.post('/addproduct', addProduct)
router.get('/', getAllProducts)
router.get('/:id', getSingleProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)
module.exports = router