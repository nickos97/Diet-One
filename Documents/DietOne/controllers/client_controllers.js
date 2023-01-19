const express = require('express')
const router = express.Router();

const {VerifyClient,VerifyEmployee,VerifyAdmin} = require('../identity_server/auth/verifyToken');
const {view_metrics} = require('../client/view_metrics');
const {insert_metrics} = require('../client/insert_metrics');
const {insert_feedback} = require('../client/insert_feedback');
const {client_diet} = require('../client/client_diet');
const {get_foods} = require('../client/get_foods');
const {edit_diet} = require('../client/edit_diet');
const { delete_meal } = require('../client/delete_meal');
const { get_feedback } = require('../client/get_feedback');
const { get_quantities } = require('../client/get_quantities');
const { set_client_event } = require('../client/client_events/set_client_event');
const { update_client_event } = require('../client/client_events/update_client_event');
const { get_client_event } = require('../client/client_events/get_client_event');
const { delete_client_event } = require('../client/client_events/delete_client_event');
const { get_files } = require('../client/files_sharing/get_files');
const { get_account } = require('../client/get_account');
/**
 * @swagger
 * /:
 *  get:
 *      summary: This is an api
 *      description: This is an api
 *      responses:
 *           200:
 *              description: Test get method
 */
router.route('/view_metrics').get(VerifyClient,view_metrics)
router.route('/my_diet').get(VerifyClient,client_diet)
router.route('/get_foods').get(get_foods)
router.route('/get_feedback/:date').get(VerifyClient,get_feedback)
router.route('/get_quantities').get(VerifyClient,get_quantities)
router.route('/get_client_event').get(VerifyClient,get_client_event)
router.route('/get_files').get(VerifyClient,get_files)
router.route('/get_account').get(VerifyClient,get_account)

router.route('/insert_metrics').post(VerifyClient,insert_metrics)
router.route('/insert_feedback').post(VerifyClient,insert_feedback)
router.route('/edit_diet').post(VerifyClient,edit_diet)
router.route('/set_client_event').post(VerifyClient,set_client_event)

router.route('/update_client_event').put(VerifyClient,update_client_event)

router.route('/delete_meal_app/:id').delete(VerifyClient,delete_meal)
router.route('/delete_client_event/:id').delete(VerifyClient,delete_client_event)

module.exports = router;