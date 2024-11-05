const { response } = require('express');
const tasksModel = require('../models/taskModel')

const getALL = async (_req, res) =>{
const tasks = await tasksModel.getAll();
return res.status(200).json(tasks);
};

const createTask = async (request, response) => {
   const createdTask = await tasksModel.createTask(request.body);
    return response.status(201).json(createdTask);
}

const deleteTask = async (request,response) => {
    const {id} = request.params;

    await tasksModel.deleteTask(id);
    return response.status(204).json();
}

const updateTask = async (req, res) => {
    const {id}= req.params;

    await tasksModel.updateTask(id , req.body);
    return res.status(204).json();
}

module.exports = {
    getALL,
    createTask,
    deleteTask,
    updateTask
};