const express = require('express');
const { getAllClients } = require('../admin/getAllClients');
const { create_coupon } = require('../employee/stripe_utils/create_coupon');
const {VerifyClient,VerifyEmployee,VerifyAdmin} = require('../identity_server/auth/verifyToken');
const router = express.Router();

router.route('/getAllClients').get(VerifyAdmin,getAllClients)
router.route('/create_coupon').post(VerifyEmployee,create_coupon)

module.exports = router;