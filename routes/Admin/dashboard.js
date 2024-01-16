const express = require('express');
const router = express.Router();
const { getDashboard } = require('../../controllers/admin/dashboard');

router.get('/', getDashboard)


module.exports = router;