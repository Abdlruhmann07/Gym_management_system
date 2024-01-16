const express = require('express');
const router = express.Router();

const { addMember,
    getaddMember,
    getAllMembers,
    viewSingleMember,
    deleteMember,
    updateSingleMember,
    viewMemberAttendance,
    asignMemberToPlan,
    asignMemberToClass,
    viewAvailableClassesToJoin,
    viewAvailablePlans,
} = require('../../controllers/Admin/memberControllers');
const { authenticate, authorize } = require('../../middlewares/auth');
const { uploadPhoto } = require('../../helpers/upload/user');

router.get('/', getAllMembers) // tested
router.get('/addmember', authenticate, getaddMember)
router.get('/:id', authenticate, viewSingleMember) //tested
router.post('/addmember', authenticate, uploadPhoto, addMember) //tested
router.delete('/deleteMember/:id', deleteMember) // tested
router.put('/updateMember/:id', updateSingleMember) // tested
router.get('/:id/view-member-attendance', viewMemberAttendance) // 
router.get('/:id/available-sessions', viewAvailableClassesToJoin)
router.get('/:id/available-plans', viewAvailablePlans)
router.post('/:memberId/:planId/sign-member-to-plan', asignMemberToPlan) //
router.post('/:memberId/:sessionId/sign-member-to-class', asignMemberToClass) // tested
router.get('/:id/view-member-attendance', viewMemberAttendance)

// get pages
module.exports = router;