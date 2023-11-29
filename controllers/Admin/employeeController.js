const Employee = require('../../models/employee');
const signToken = require('../../helpers/signtoken');
// employee 
// add new employee
exports.addEmployee = (req, res) => {
    try {
        const {
            name, age, adress, phone, payroll, photo
        } = req.body;
        const employee = Employee.create({
            name, age, adress, phone, payroll, photo
        })
        res.status(200).json({ state: 'success', data: employee });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
};
// view all employees
exports.viewAllEmployees = (req, res) => {
    try {
        const employees = Employee.find({ role: 'employee' });
        if (equipments.length === 0) return res.status(404).json('No employees yet');
        res.status(200).json({ state: 'success', data: employees });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
};
// update employee
exports.updateEmployee = (req, res) => {
    try {
        const id = req.params.id;
        const updatedEmployee = Employee.findByIdAnUpdate(id, req.body, { new: true });
        if (!updatedEmployee) {
            res.status(404).json({ state: 'error', message: 'No employee found' })
        }
        res.status(200).json({ state: 'success', data: updatedEmployee });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message })
    }
};
// delete employee
exports.deleteEmployee = (req, res) => {
    try {
        const id = req.params.id;
        const deletedEmployee = Employee.findByIdAndDelete(id);
        res.status(204).json({ state: 'success', deleted: deletedEmployee });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}
//Trainer
// signup trainer
exports.signupTrainer = async (req, res) => {
    // console.log(req.body);
    try {
        const {
            email, password, name, age, address, phone, payroll, photo, Classes
        } = req.body;
        const newTrainer = await Employee.create(
            {
                email, password, name, age, address, phone, payroll, photo, Classes, role: 'Trainer',
            }
        )
        const token = signToken(newTrainer);
        // res.
        res.cookie('token', token, {
            httpOnly: true,
        }).status(201).json({ message: 'Successful Register', token, employoee: newTrainer });
        // res.redirect('/')
    } catch (err) {
        res.status(500).json({
            status: 'failed',
            message: err.message,
        })
    }
};
// login trainer

// view all trainers
// update trainer
// delete trainer
// sign trainer to class

// Manager
// add manager
// view all managers
// update manager
// delete manager