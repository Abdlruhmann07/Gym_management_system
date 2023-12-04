const express = require('express');
const router = express.Router();
const { addEmployee,
    viewAllEmployees,
    viewSingleEmployee,
    updateEmployee,
    deleteEmployee } = require('../../controllers/Admin/employeeController');

router.post('/add-employee', addEmployee) //tested
router.get('/', viewAllEmployees) //tested
router.get('/:id', viewSingleEmployee) //tested
router.put('/:id', updateEmployee) //tested
router.delete('/:id', deleteEmployee)//tested


module.exports = router;