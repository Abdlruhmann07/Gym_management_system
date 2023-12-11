const express = require('express');
const router = express.Router();

const { getAllMemberships } = require('../../controllers/member/memberControllers');
const { authenticate } = require('../../controllers/authControllers');
router.get('/', authenticate, getAllMemberships)
module.exports = router; 