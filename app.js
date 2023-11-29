require('dotenv').config({});
const express = require('express');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;
const app = express();
// using middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('')
// mounting routes
const authRoutes = require('./routes/authRoutes');
const membershipsRoutes = require('./routes/Admin/membershipRoutes');
const classesRoutes = require('./routes/Admin/ClassRoutes');
const memberRoutes = require('./routes/Admin/memberRoutes')
const equipmentRoutes = require('./routes/Admin/EquipmentRoutes');
const employeeRoutes = require('./routes/Admin/employeeRoutes');
const trianerRoutes = require('./routes/Admin/trainerRoutes');
app.use(authRoutes);
app.use('/api/admin/memberships', membershipsRoutes);
app.use('/api/admin/members', memberRoutes);
app.use('/api/admin/classes', classesRoutes);
app.use('/api/admin/equipments', equipmentRoutes);
app.use('/api/admin/employees', employeeRoutes);
app.use('/api/admin/trainers', trianerRoutes);
//End

// Database connection
const dbConnect = require('./db/dbConnection');
dbConnect();
//End

// app listening
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})