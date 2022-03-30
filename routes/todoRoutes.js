const { Router } = require('express');
const { route } = require('express/lib/application');
const todoController = require('../controllers/todoController');

const router = Router();

router.get("/", todoController.getTodos);

router.post("/add", todoController.postAddTodo);

router.put("/update/:id", todoController.updateTodo);

router.delete("/delete/:id", todoController.deleteTodo);

module.exports = router;