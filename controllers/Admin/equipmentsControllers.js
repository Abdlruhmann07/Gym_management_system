const Equipment = require('../../models/equipment')
// Add new Equipment
exports.addEquipment = async (req, res) => {
    const { name, description, price, quantity, status, brand } = req.body;
    try {
        // check if equipment is already exist -> increment quantity
        let existingEquipment = await Equipment.findOne({ name, brand });
        if (existingEquipment) {
            existingEquipment.quantity += quantity;
            await existingEquipment.save();
            return res.status(200).json({ state: 'success', data: existingEquipment });
        } else {
            const newEquipment = await Equipment.create({
                name,
                description,
                price,
                quantity,
                status,
                brand
            });
            res.status(200).json({ state: 'success', data: newEquipment });
        }

    } catch (err) {
        res.status(500).json({ state: "error", message: err.message });
    }
};

// view all Equipments
exports.viewAllEquipments = async (req, res) => {
    try {
        const equipments = await Equipment.find({ status: 'available' });
        if (equipments.length === 0) return res.status(404).json('No Equipments yet');
        res.status(200).json({ state: 'sucess', data: equipments })
    } catch (err) {
        res.status(500).json({ state: "error", message: err.message });
    }
};

// view single Equipment
exports.viewSingleEquipment = async (req, res) => {
    try {
        const id = req.params.id;
        const equipment = await Equipment.findById(id);
        if (!equipment) {
            res.status(401).json('no equipment with this id')
        }
        res.status(200).json({ state: 'sucess', data: equipment });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message })
    }
}
// Update single Equipment
exports.updateSingleEquipment = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedEquipment = await Equipment.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedEquipment) {
            res.status(404).json({ state: 'error', message: 'no equipment with this id' })
        }
        res.status(200).json({ state: 'sucess', data: updatedEquipment });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message })
    }
};

// Delete single Equipment
exports.deleteEquipment = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedEquipment = await Equipment.findByIdAndDelete(id);
        if (!deletedEquipment) {
            res.status(404).json({ state: 'error', message: 'no equipment with this id' })
        }
        res.status(200).json({ state: 'sucess', data: deletedEquipment });
    } catch (err) {
        res.status(500).josn({ state: 'error', message: err.message })
    }
};

// set equipment to maintenance

exports.setEquipmentToMaintenance = async (req, res) => {
    try {
        const id = req.params.id;
        const maintenanceEquipment = await Equipment.findByIdAndUpdate(
            id, { status: 'maintenance' }, { new: true }
        )
        if (!maintenanceEquipment) {
            res.status(404).json({ state: 'error', message: 'no equipment with this id' });
        }
        res.status(200).json({ state: 'sucess', data: maintenanceEquipment });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message })
    }
};
// set equipment back to available state
exports.setEquipmentToAvailable = async (req, res) => {
    try {
        const id = req.params.id;
        const availableEquipment = await Equipment.findByIdAndUpdate(
            id, { status: 'available' }, { new: true }
        );
        if (!availableEquipment) {
            res.status(404).json({ state: 'error', message: 'No equipment with this id' });
        }
        // Remove the equipment from the maintenanceEquipments array
        // const index = maintenanceEquipments.findIndex(equipment => equipment.id === id);
        // if (index !== -1) {
        //     maintenanceEquipments.splice(index, 1);
        // }
        res.status(200).json({ state: 'success', data: availableEquipment });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}
// View all maintenance equipments
exports.viewAllMaintenanceEquipment = async (req, res) => {
    try {
        const maintenanceEquipments = await Equipment.find({ status: 'maintenance' })
        if (maintenanceEquipments.length === 0) return res.status(404).json('No maintenanceEquipments yet');
        res.status(200).json({ state: 'success', data: maintenanceEquipments })
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
};