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
const adminRoutes = require('./routes/Admin/index');
const memberRoutes = require('./routes/memberRoutes');
app.use('/api/v1/', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/member', memberRoutes);
//End

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