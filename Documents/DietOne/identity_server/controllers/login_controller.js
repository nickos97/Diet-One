const express = require('express')
const router = express.Router();
const {login} = require('../login')
const {employee_login} = require('../employee_login')

router.route('/login').post(login)
router.route('/emp_login').post(employee_login)
module.exports = router;