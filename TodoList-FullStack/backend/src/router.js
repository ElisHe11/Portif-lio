const express = require('express');
const tasksController = require('./controllers/tasksController');
const { validateFieldTitle, validateFieldStatus } = require('./middlewares/tasksMiddleware');


const router = express.Router();

router.get('/tasks', tasksController.getALL)
router.post('/tasks', validateFieldTitle ,tasksController.createTask)
router.delete('/tasks/:id', tasksController.deleteTask)
router.put('/tasks/:id', 
    validateFieldTitle, 
    validateFieldStatus, 
    tasksController.updateTask)

module.exports = router;