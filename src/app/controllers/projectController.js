const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const authMiddleware = require('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();/*  */

router.use(authMiddleware); // verification of token

router.get('/', async(req, res) =>{
   //res.send({ user: req.userId });
  try {
   const project = await Project.find().populate(['user', 'tasks']);

res.send({ project });

}catch (err) {
   console.log(err);
   return res.status(400).send({error: 'Error List News PRJ'});
}
});

router.get('/:projectId', async(req, res) =>{
  // res.send({ user: req.userId });
  try {
   const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);

   res.send({ project });
}catch (err) {
   console.log(err);
   return res.status(400).send({error: 'Error list by id New PRJ'});
}
});

router.post('/', async(req, res) =>{
  // res.send({ user: req.userId });
  try {
   
    const { title, description, tasks } = req.body;

    const project = await Project.create({ title, description, user: req.userId });

    await Promise.all(tasks.map(async task => { 
       const projectTask = new Task ({ ...task, project: project._id});
       await projectTask.save();
       project.tasks.push(projectTask);

    }));
    
    await project.save();
    return res.send({ project });

  }
  catch (err) {
     console.log(err);
     return res.status(400).send({error: 'Error Creating New PRJ'});

  }

});

router.put('/:projectId', async(req, res) =>{
   // res.send({ user: req.userId });
    // res.send({ user: req.userId });
  try {
   
   const { title, description, tasks } = req.body;

   const project = await Project.findByIdAndUpdate(req.params.projectId, {
       title,
        description, 
        user: req.userId 
      }, { new: true});// reflesh

      // remove all tasks
      project.tasks = [];
      await Task.remove({ project: project_id });

   await Promise.all(tasks.map(async task => { 
      const projectTask = new Task ({ ...task, project: project._id});
      await projectTask.save();
      project.tasks.push(projectTask);

   }));
   
   await project.save();
   return res.send({ project });

 }
 catch (err) {
    console.log(err);
    return res.status(400).send({error: 'Error Update New PRJ'});

 }
});

router.delete('/:projectId', async(req, res) =>{
  // res.send({ user: req.userId });
  try {
   const project = await Project.findByIdandRemove(req.params.projectId);

   res.send();
}catch (err) {
   console.log(err);
   return res.status(400).send({error: 'Error removing New PRJ'});
}
});


module.exports = app => app.use('/projects', router);