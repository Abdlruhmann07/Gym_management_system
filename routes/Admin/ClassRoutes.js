const express = require('express');
const router = express.Router();

const { addClass, getAddClaasPage, getAllClasses, deleteClass , updateClass } = require('../../controllers/Admin/classController');
// api routes
router.get('/', getAllClasses);
router.post('/addclass', addClass)
router.delete('/deleteclass/:id', deleteClass)
router.put('/updateclass/:id', updateClass)

// Get pages
router.get('/addclass', getAddClaasPage)

module.exports = router;