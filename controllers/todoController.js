const Todo = require("../models/todoModel");

exports.getTodos = async(req, res, next) => {
    try {
        const todos = await Todo.findAll({
            where: {
                userId: req.userId
            }
        });
        res.status(200).json({
            message: "Todos fetched successfully",
            data: todos
        })
    } catch (err) {
        console.log(err);
    }
}
exports.postAddTodo = async(req, res, next) => {
    const title = req.body.title;
    try {
        const todo = await Todo.create({
            title: title,
            completed: false,
            userId: req.userId
        });
        res.status(200).json({
            message: "Todo added successfully",
            data: todo
        })
    } catch (err) {
        console.log(err);
    }
}

exports.updateTodo = async(req, res, next) => {
    const id = req.params.id;
    const title = req.body.title;
    const completed = req.body.completed == "true" || req.body.completed == true;
    try {
        const todo = await Todo.findByPk(id);
        if (!todo) {
            const error = new Error("Todo not found");
            error.statusCode = 404;
            throw error;
        }
        if (todo.userId !== req.userId) {
            const error = new Error("Not authorized");
            error.statusCode = 403;
            throw error;
        }
        todo.title = title;
        todo.updatedAt = new Date();
        todo.completed = completed;
        await todo.save();
        res.status(200).json({
            message: "Todo updated successfully",
            data: todo
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteTodo = async(req, res, next) => {
    const id = req.params.id;
    try {
        const todo = await Todo.findByPk(id);
        if (!todo) {
            const error = new Error("Todo not found");
            error.statusCode = 404;
            throw error;
        }
        if (todo.userId !== req.userId) {
            const error = new Error("Not authorized");
            error.statusCode = 403;
            throw error;
        }
        await todo.destroy();
        res.status(200).json({
            message: "Todo deleted successfully",
            data: todo
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}