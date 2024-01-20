const express = require('express');
const router = express();
const { s_authenticate } = require('../../middlewares/staffAuth');
const { attendance, searchMember , newMember , renewPage , changePlan , reportProblem , paymentHistory} = require('../../controllers/staff/staffControllers');
router.get('/test', s_authenticate, (req, res) => {
    const staff = req.staff;
    res.render('test', { staff });
})
router.post('/search', searchMember)
// get pages
router.get('/attendance', attendance)
router.get('/new-member', newMember)
router.get('/renew-plan', renewPage)
router.get('/change-plan', changePlan)
router.get('/report-problem', reportProblem)
router.get('/payment-history', paymentHistory)
module.exports = router;