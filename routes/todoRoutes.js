const { Router } = require('express');
const todoController = require('../controllers/todoController');
const isAuth = require('../middleware/isAuth');

const router = Router();

router.get("/", isAuth, todoController.getTodos);

router.post("/add", isAuth, todoController.postAddTodo);

router.put("/update/:id", isAuth, todoController.updateTodo);

router.delete("/delete/:id", isAuth, todoController.deleteTodo);

module.exports = router;