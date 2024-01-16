require('dotenv').config({});
const express = require('express');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;
const path = require('path');
const app = express();

// using middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
// mounting routes
const authRoutes = require('./routes/authRoutes');
const staffAuthRoutes = require('./routes/auth/staffAuthRoutes');
const staffRoutes = require('./routes/Staff/staffRoutes');
const adminRoutes = require('./routes/Admin/index');
const memberRoutes = require('./routes/memberRoutes');
const attendanceRoutes = require('./routes/attendance');
app.use('/api/v1', authRoutes);
app.use('/api/v1', staffAuthRoutes);
app.use('/api/v1', attendanceRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/member', memberRoutes);
//End
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
// Database connection
const dbConnect = require('./db/dbConnection');
async function connect(dbConnect) {
    await dbConnect();
}
connect(dbConnect);

//End

// app listening
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/api/v1`);
})