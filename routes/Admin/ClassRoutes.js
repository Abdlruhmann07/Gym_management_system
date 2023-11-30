const express = require('express');
const router = express.Router();


const { addClass,
    getAddClaasPage,
    getAllClasses,
    getSingleClass,
    deleteClass,
    updateClass,
    assignTrainerToClass,
    assignMembersToClass,
    deleteTrainerFromClass,
    viewAllClassMembers,
    deleteMembersFromClass } = require('../../controllers/Admin/classController');
// api Endpoints
router.get('/', getAllClasses);
router.get('/:id', getSingleClass)
router.post('/addclass', addClass)
router.delete('/deleteclass/:id', deleteClass)
router.put('/updateclass/:id', updateClass)
router.post('/assign-trainer-to-class', assignTrainerToClass)// tested
router.post('/assign-members-to-class', assignMembersToClass)// tested
router.delete('/delete-trainer-from-class/:classId', deleteTrainerFromClass) //tested
router.put('/:classId/members/delete-members-from-class', deleteMembersFromClass)//tested
router.get('/:classId/members', viewAllClassMembers) // tested
// Get pages
router.get('/addclass', getAddClaasPage)

module.exports = router;