const express = require('express')
const router = express.Router();
const {employee_register,client_register} = require('../register')
const {app_register} = require('../app_register')

router.route('/emp_register').post(employee_register)
router.route('/cl_register').post(client_register)
router.route('/app_register').post(app_register)

module.exports = router;