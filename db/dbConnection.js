const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL 
const dbConnect = async () => {
    try {
        const db = await mongoose.connect(DB_URL);
        console.log('database connected', db.connection.host)
    } catch (error) {
        console.error('error connecting database', error.message)
    }
}

module.exports = dbConnect;