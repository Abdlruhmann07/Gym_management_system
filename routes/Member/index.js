const express = require('express');
const router = express.Router();
const  memberShipsRoutes  = require('./memberships');
router.use('/memberships', memberShipsRoutes)


module.exports = router