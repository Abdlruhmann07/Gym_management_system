const express = require('express')
const router = express.Router();

const membershipsRoutes = require('./membershipRoutes');
const classesRoutes = require('./ClassRoutes');
const memberRoutes = require('./memberRoutes')
const equipmentRoutes = require('./EquipmentRoutes');
const employeeRoutes = require('./employeeRoutes');
const trianerRoutes = require('./trainerRoutes');
const storeRoutes = require('./storeRoutes/index');
const dashboard = require('./dashboard');
const payments = require('./payment');




router.use('/plans', membershipsRoutes);
router.use('/members', memberRoutes);
router.use('/sessions', classesRoutes);
router.use('/equipments', equipmentRoutes);
router.use('/staff', employeeRoutes);
router.use('/trainers', trianerRoutes);
router.use('/employees', employeeRoutes);
router.use('/store', storeRoutes)
router.use('/dashboard', dashboard)
router.use('/payments', payments)
module.exports = router