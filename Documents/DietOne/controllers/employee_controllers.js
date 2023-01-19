const express = require('express')
const router = express.Router();
const {VerifyClient,VerifyEmployee,VerifyAdmin} = require('../identity_server/auth/verifyToken');

const {search_bar} = require('../utils/general')
const {add_client} = require('../employee/client_general/add_client')
const {client_by_id} = require('../employee/client_general/client_by_id')
const {meal_by_id} = require('../employee/recipe_repository/meal_by_id')
const {view_client_info} = require('../employee/client_general/view_client_info')
const {update_client_info} = require('../employee/client_general/update_client_info')
const {get_client_metrics} = require('../employee/client_general/get_client_metrics')
const {insert_diet_meal} = require('../employee/diet_plan/insert_diet_meal')
const {view_diet_plan} = require('../employee/diet_plan/view_diet_plan')
const {create_meal} = require('../employee/recipe_repository/create_meal')
const {retrieve_meals} = require('../employee/recipe_repository/retrieve_meals')
const {delete_meal} = require('../employee/recipe_repository/delete_meal');
const {delete_diet_meal} = require('../employee/diet_plan/delete_diet_meal');
const { set_client_goals } = require('../employee/client_general/set_client_goals');
const { get_client_goals } = require('../employee/client_general/get_client_goals');
const { get_percentages } = require('../employee/client_general/get_percentages');
const { add_food } = require('../employee/food_utils/add_food');
const {set_nutrition_history} = require('../employee/client_history/set_nutrition_history')
const {get_nutrition_history} = require('../employee/client_history/get_nutrition_history')
const {set_exercise_history} = require('../employee/client_history/set_exercise_history')
const {get_exercise_history} = require('../employee/client_history/get_exercise_history')
const {update_food_label} = require('../employee/food_utils/update_food_label');
const { create_meeting } = require('../employee/meetings/create_meeting');
const { update_meeting } = require('../employee/meetings/update_meeting');
const { delete_meeting } = require('../employee/meetings/delete_meeting');
const { get_meetings } = require('../employee/meetings/get_meetings');
const { create_task } = require('../employee/ToDoList/create_task');
const { update_task } = require('../employee/ToDoList/update_task');
const { get_tasks } = require('../employee/ToDoList/get_tasks');
const { delete_task } = require('../employee/ToDoList/delete_task');
const { create_coupon } = require('../employee/stripe_utils/create_coupon');
const { get_client_feed } = require('../employee/client_general/get_client_feed');


//search util route
router.route('/search_food').post(search_bar)

//employee routes

//Http method: get
router.route('/retrieve_meals').get(VerifyEmployee,retrieve_meals)
router.route('/view_meal/:id').get(VerifyEmployee,meal_by_id)
router.route('/get_client_metrics').get(VerifyEmployee,get_client_metrics)
router.route('/view_client/:id').get(VerifyEmployee,client_by_id)
router.route('/client_info').get(VerifyEmployee,view_client_info)
router.route('/get_client_goals/:id').get(VerifyEmployee,get_client_goals)
router.route('/get_percentages/:id/:span').get(VerifyEmployee,get_percentages)
router.route('/get_nutrition_history/:id').get(VerifyEmployee,get_nutrition_history)
router.route('/get_exercise_history/:id').get(VerifyEmployee,get_exercise_history)
router.route('/get_meetings/:id').get(VerifyEmployee,get_meetings)
router.route('/get_meetings').get(VerifyEmployee,get_meetings)
router.route('/get_tasks').get(VerifyEmployee,get_tasks)
router.route('/get_client_feed/:id/:span').get(VerifyEmployee,get_client_feed)

//Http method: put
router.route('/update_client').put(VerifyEmployee,update_client_info)
router.route('/insert_meal').put(VerifyEmployee,insert_diet_meal)
router.route('/set_client_goals').put(VerifyEmployee,set_client_goals)
router.route('/set_nutrition_history').put(VerifyEmployee,set_nutrition_history)
router.route('/set_exercise_history').put(VerifyEmployee,set_exercise_history)
router.route('/update_food_label').put(VerifyEmployee,update_food_label)
router.route('/update_meeting').put(VerifyEmployee,update_meeting)
router.route('/update_task').put(VerifyEmployee,update_task)

//Http method: post
router.route('/add_client').post(VerifyEmployee,add_client)
router.route('/create_meal').post(VerifyEmployee,create_meal)
router.route('/view_diet_plan').post(VerifyEmployee,view_diet_plan)
router.route('/add_food').post(VerifyEmployee,add_food)
router.route('/create_meeting').post(VerifyEmployee,create_meeting)
router.route('/create_task').post(VerifyEmployee,create_task)
router.route('/create_coupon').post(VerifyEmployee,create_coupon)


//Http method: delete
router.route('/delete_meal/:id').delete(VerifyEmployee,delete_meal)
router.route('/delete_diet_meal/:id').delete(VerifyEmployee,delete_diet_meal)
router.route('/delete_meeting/:id').delete(VerifyEmployee,delete_meeting)
router.route('/delete_task/:id').delete(VerifyEmployee,delete_task)


module.exports = router;