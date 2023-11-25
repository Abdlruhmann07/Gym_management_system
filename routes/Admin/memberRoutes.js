const express = require('express');
const router = express.Router();

const { addMember, getaddMember, getAllMembers, viewSingleMember, deleteMember, updateSingleMember } = require('../../controllers/Admin/memberControllers');
const { authenticate, authorize } = require('../../controllers/authControllers');
router.get('/', authenticate, getAllMembers)
router.get('/:id', authenticate, viewSingleMember)
router.post('/addmember', authenticate, authorize('admin'), addMember)
router.delete('/:id', deleteMember)
router.put('/:id', updateSingleMember)


// get pages
router.get('/addmember', authenticate, getaddMember)
module.exports = router;