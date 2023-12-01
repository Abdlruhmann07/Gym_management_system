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
app.use(authRoutes);
app.use('/api/admin', adminRoutes);
//End

// Database connection
const dbConnect = require('./db/dbConnection');
dbConnect();
//End

// app listening
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})