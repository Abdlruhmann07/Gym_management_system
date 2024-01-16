const express = require('express');
const router = express.Router();
const {
    addMemberShip,
    getAddMembership,
    getAllMemberships,
} = require('../../controllers/Admin/membershipController');
const { authenticate, authorize } = require('../../middlewares/auth');

router.post('/addplan',  addMemberShip)
router.get('/addmembership', authenticate, getAddMembership)
router.get('/', authenticate, getAllMemberships);
module.exports = router;