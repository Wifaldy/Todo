const Todo = require("../models/todoModel");

exports.getTodos = async(req, res) => {
    try {
        const todos = await Todo.findAll();
        res.status(200).json({
            message: "Todos fetched successfully",
            data: todos
        })
    } catch (err) {
        console.log(err);
    }
}
exports.postAddTodo = async(req, res) => {
    const title = req.body.title;
    try {
        const todo = await Todo.create({
            title: title,
            completed: false
        });
        res.status(200).json({
            message: "Todo added successfully",
            data: todo
        })
    } catch (err) {
        console.log(err);
    }
}

exports.updateTodo = async(req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    try {
        const todo = await Todo.findByPk(id);
        todo.title = title;
        todo.updatedAt = new Date();
        await todo.save();
        res.status(200).json({
            message: "Todo updated successfully",
            data: todo
        })
    } catch (err) {
        console.log(err);
    }
}

exports.deleteTodo = async(req, res) => {
    const id = req.params.id;
    try {
        const todo = await Todo.findByPk(id);
        await todo.destroy();
        res.status(200).json({
            message: "Todo deleted successfully",
            data: todo
        })
    } catch (err) {
        console.log(err);
    }
}