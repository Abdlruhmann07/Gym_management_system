const express = require('express');
const router = express.Router();

const { addEquipment,
    viewAllEquipments,
    viewSingleEquipment,
    updateSingleEquipment,
    deleteEquipment,
    setEquipmentToMaintenance,
    setEquipmentToAvailable,
    viewAllMaintenanceEquipment
} = require('../../controllers/Admin/equipmentsControllers')
router.get('/', viewAllEquipments) // tested
router.get('/maintenance-equipments', viewAllMaintenanceEquipment)// tested
router.post('/add-equipment', addEquipment) // tested
router.put('/update-equipment/:id', updateSingleEquipment)//tested
router.delete('/:id', deleteEquipment)//tested
router.put('/set-equipment-to-maintenance/:id', setEquipmentToMaintenance)//tested
router.put('/maintenance-equipments/set-equipment-to-available/:id', setEquipmentToAvailable)//tested
router.get('/:id', viewSingleEquipment) // tested
module.exports = router;