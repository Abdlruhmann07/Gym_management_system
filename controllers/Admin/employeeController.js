const Employee = require('../../models/employee');

// employee 

// add new employee
exports.addEmployee = async (req, res) => {
    try {
        const {
            firstname, lastname, age, address, phone, payroll, photo,
        } = req.body;
        const employee = new Employee({
            firstname,
            lastname,
            age,
            address,
            phone,
            payroll,
            photo
        });
        await employee.save();
        res.status(200).json({ state: 'success', data: employee });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
};
// view all employees
exports.viewAllEmployees = async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || ""
        let query = {};
        if (search) {
            if (!isNaN(search)) {
                query.id = search;
            } else {
                query.firstname = { $regex: search, $options: 'i' };
            }
        }
        const employeesCount = await Employee.countDocuments(query)
        const totalPages = Math.ceil(employeesCount / limit);
        const employees = await Employee.find(query).skip(page * limit).limit(limit);

        if (employees.length === 0) return res.status(404).json('No employees yet');

        res.status(200).json({ state: 'success', data: employees, pages: totalPages, count: employeesCount });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
};
// view single employee
exports.viewSingleEmployee = async (req, res) => {
    const id = req.params.id
    try {
        const employee = await Employee.findById(id);
        if (!employee) { return res.status(404).json({ message: 'No employee with this id' }) }
        res.status(201).json({ state: 'success', data: employee })
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
};
// update employee
exports.updateEmployee = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedEmployee) {
            res.status(404).json({ state: 'error', message: 'No employee found' })
        }
        res.status(200).json({ state: 'success', data: updatedEmployee });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message })
    }
};
// delete employee
exports.deleteEmployee = async (req, res) => {
    try {
        const id = req.params.id;
        const employees = await Employee.find({});
        if (employees.length < 1) {
            return res.status(404).json({ state: 'error', message: 'No employees to delete' })
        }
        const deletedEmployee = await Employee.findByIdAndDelete(id);
        if (!deletedEmployee) {
            return res.status(404).json({ state: 'error', message: 'No Employee Found with this id' });
        }
        res.status(200).json({ state: 'success', deleted: deletedEmployee });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}

