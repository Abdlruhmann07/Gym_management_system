const paymentModel = require('../../models/payment')
exports.getPaymentHistory = async (req, res) => {
    const filter = req.query.filter || '';
    try {
        let query = {};
        if (filter) {
            query.paymentType = filter;
        }
        const payments = await paymentModel.find(query).populate('user')
        console.log(payments);
        res.render('admin/payments', { payments })
        // res.json(payments)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getSinglePayment = async (req, res) => {
    const paymentId = req.params.id;
    try {
        const payment = await paymentModel.findById(paymentId)
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        return res.status(200).json({ state: 'success', data: payment });
    } catch (err) {
        return res.status(500).json({ state: 'fail', message: err.message });
    }
};