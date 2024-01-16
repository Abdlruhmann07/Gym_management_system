const paymentModel = require('../../models/payment')
exports.getPaymentHistory = async (req, res) => {
    const filter = req.query.filter || '';
    try {
        let query = {};
        if (filter) {
            query.paymentType = filter;
        }
        const payments = await paymentModel.find({ query })
        res.render('admin/payments', payments)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}