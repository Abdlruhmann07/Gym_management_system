const Equipment = require('../../controllers/Admin/equipmentsControllers')
// Add new Equipment
exports.addEquipment = async (req, res) => {
    const { name, description, price, quantity, status, brand } = req.body;
    try {
        const newEquipment = await Equipment.create({
            name,
            description,
            price,
            quantity,
            status,
            brand
        });
        res.status(200).json({ state: 'success', data: newEquipment });
    } catch (err) {
        res.status(500).json({ state: "error", message: err.message });
    }
};

// view all Equipments
exports.viewAllEquipments = async (req, res) => {
    try {
        const equipments = await Equipment.find({});
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