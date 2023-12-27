const Product = require('../../../models/product');

// Add new product
exports.addProduct = async (req, res) => {
    const { title, description, price, category, photo, quantity } = req.body;
    console.log(req.body);
    try {
        // Check if the product already exists
        let existingProduct = await Product.findOne({ title });
        //
        if (existingProduct) {
            // If the product exists, increment the quantity
            if (quantity) {
                existingProduct.quantity += quantity;
                await existingProduct.save({ validateBeforeSave: false });
                res.status(200).json({
                    status: 'success',
                    data: existingProduct
                });
            
        } else {
            existingProduct.quantity++;
            await existingProduct.save({ validateBeforeSave: false });
            res.status(200).json({
                status: 'success',
                data: existingProduct
            });
        }
    } else {
        // create new product
        const newProduct = new Product({
            title,
            description,
            price,
            category,
            photo,
            quantity,
        });
        // saving the document
        const saved = await newProduct.save();
        // console.log(saved);
        res.status(201).json({
            status: 'success',
            data: saved
        });
    }
} catch (error) {
    res.status(500).json({
        status: 'fail',
        message: error.message
    });
}
}; //! DONE!
// view all products
exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || ""

        const products = await Product.find({
            status: 'available',
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { id: parseInt(search) || 0 }
            ],
        }).skip(page * limit).limit(limit);
        if (products.length === 0) return res.status(404).json('No products yet');
        res.status(200).json({ state: 'sucess', data: products })
    } catch (err) {
        res.status(500).json({ state: "error", message: err.message });
    }
} //! DONE!
// view single product
exports.getSingleProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const singleProduct = await Product.findById(productId);
        if (!singleProduct) return res.status(404).json({ state: "error", message: 'Product not found' })
        return res.status(404).json({ state: "success", data: singleProduct });
    } catch (err) {
        return res.status(500).json({ state: "error", message: err.message });
    }
} //! DONE!
// update single product
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProduct = await Product.findByIdAndUpdate(
            productId, req.body, { new: true }
        )
        if (!updatedProduct) return res.status(404).json({ state: 'error', message: 'Product not found' });
        return res.status(200).json({ state: 'success', data: updatedProduct });
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message });
    }
} //! DONE!
// delete single product
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId)
        if (!deletedProduct) return res.status(404).json({ state: 'error', message: 'Product not found' });
        return res.status(200).json({ state: 'success', data: deletedProduct });
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message });
    }
} //! DONE!
// 