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
router.get('/', getAllClasses);//! done
router.get('/:id', getSingleClass) //! done
router.post('/addclass', addClass) //! done
router.delete('/deleteclass/:id', deleteClass) //! done
router.put('/updateclass/:id', updateClass) //! done
router.post('/:id/assign-trainer-to-class', assignTrainerToClass)// tested //! done
router.post('/:id/assign-members-to-class', assignMembersToClass)// tested //! done
router.delete('/:id/delete-trainer-from-class/', deleteTrainerFromClass) //tested //! done
router.put('/:id/members/delete-members-from-class', deleteMembersFromClass)//tested //! done
router.get('/:id/members', viewAllClassMembers) // tested //! done
// Get pages
router.get('/addclass', getAddClaasPage)

module.exports = router;