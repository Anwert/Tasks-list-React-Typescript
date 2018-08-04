const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const config = require('../config/database');

const Task = require('../models/task');

router.get('/get', (req, res) => {
  //find user by token
  const id = jwt.decode(req.headers.token, config.secret).id;
  //query for finding tasks only for this user
  const query = { userId: id }

  Task.find(query, (err, tasks) => {
    if (err) return console.log(err);
    res.json(tasks);
  });
});

router.post('/add', (req, res) => {
  const id = jwt.decode(req.headers.token, config.secret).id;

  console.log(req.headers)
  console.log(id)

  const task = new Task();
  task.userId = id;
  task.value = req.body.value;
  task.date = req.body.date;
  task.completed = false;

  task.save((err) => {
    if (err) return console.log(err);
    res.json(task);
  });
});

router.delete('/delete', (req, res) => {

  const userId = jwt.decode(req.headers.token, config.secret).id;

  const query = { _id: req.body._id }

  Task.findById(query, (err, task) => {

    if (err) return console.log(err)

    if (task.userId !== userId) res.send("Your token is incorrect")

    Task.remove(query, (err) => {
      if (err) return console.log(err);
      res.send("Task was deleted succussfully!");
    });
  })
});

router.put('/edit', (req, res) => {

  const userId = jwt.decode(req.headers.token, config.secret).id;

  const query = { _id: req.body._id }

  Task.findById(query, (err, task) => {

    if (err) return console.log(err);

    if (task.userId !== userId) res.send("Your token is incorrect")

    task.value = req.body.value;
    task.date = req.body.date;
    task.completed = req.body.completed;

    task.save((err, updatedTask) => {
      if (err) console.log(err);
      res.send("Task was edited succussfully!");
    });
  });
});

router.put('/changecomplete', (req, res) => {

  const userId = jwt.decode(req.headers.token, config.secret).id;

  const query = { _id: req.body._id }

  Task.findById(query, (err, task) => {

    if (err) return console.log(err);

    if (task.userId !== userId) res.send("Your token is incorrect")

    task.completed = !task.completed;

    task.save((err, updatedTask) => {
      if (err) return console.log(err);
      res.send("Task was edited succussfully!");
    });
  });
});

module.exports = router;
