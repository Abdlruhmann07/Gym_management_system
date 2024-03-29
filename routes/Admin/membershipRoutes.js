const express = require('express');
const router = express.Router();
const {
    addMemberShip,
    getAddMembership,
    getAllMemberships,
    updateMembership,
    getSingleMembership,
    deleteSingleMembership
} = require('../../controllers/Admin/membershipController');
const { authenticate, authorize } = require('../../middlewares/auth');

router.post('/addplan',  addMemberShip)
router.put('/updateplan/:id',  updateMembership)
router.get('/:id',  getSingleMembership)
router.delete('/:id',  deleteSingleMembership)
// router.get('/addmembership', authenticate, getAddMembership)
router.get('/', authenticate, getAllMemberships);
module.exports = router;