const router= require('express').Router()
const passport = require('passport')

// Todo modules
const Todo = require('../../Models/Todo')
// Todo validate
const validateTodoInput = require('../../validation/todo')

// Routes POST: /api/todos/
// desc : Create a todo
// access : Private

router.post('/', passport.authenticate('jwt',{session:false}), async(req, res)=>{
  try {
    const {errors, isValid} = validateTodoInput(req.body)
    if(!isValid) return res.json({
      result: 'fail',
      status: 400,
      errors
    })
    const newTodo = new Todo({
      user: req.user.id,
      text: req.body.text,
    })
    const todo = await newTodo.save()
    return res.json({
      result: 'success',
      status: 200,
      message: "Create todo success",
      item: todo
    })    
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      message: "Can't create Todo"
    })
  }
})


// Routes PUT: /api/todos/:todo_id
// desc : Edit a todo
// access : Private

router.put('/:todo_id', passport.authenticate('jwt', {session: false}), async(req, res)=> {
  try {
    const {errors, isValid} = validateTodoInput(req.body)
    if(!isValid) return res.json({
      result: 'fail',
      status: 400,
      errors
    })
    const todo = await Todo.findById(req.params.todo_id)
    if(!todo) return res.json({
      result: 'fail',
      status: 404,
      message: "Can't find any todo match that id"
    })
    todo.text = req.body.text
    const newTodo = await todo.save()
    return res.json({
      result: 'success',
      status: 200,
      message: 'Edit success',
      item: newTodo
    })
    
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      message: "Can't edit Todo"
    })
  }
})

// Routes DELETE: /api/todos/:todo_id
// desc : DELETE a post
// access : Private
router.delete('/:todo_id', passport.authenticate('jwt', {session: false}), async(req, res)=> {
  try {
    const todo = await Todo.findById(req.params.todo_id)
    if(!todo) return res.json({
      result: 'fail',
      status: 404,
      message: "Can't find any todo match that id"
    })    
    const result = await todo.remove()
    if(!result) throw new Error()
    return res.json({
      result: 'success',
      status: 200,
      message: 'Delete Success',      
    })
    
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      message: "Can't delete Todo"
    })
  }
})
// Routes GET: /api/todos/
// desc : Get all list todos of that user
// access : Private

router.get('/', passport.authenticate('jwt',{session: false}),async (req, res)=>{
  try {
    const todos = await Todo.find({
      user: req.user.id
    })
    if(!todos) throw new Error
    return res.json({
      result: 'success',
      status: 200,
      items: todos,
      message: 'Get list todo success'
    })
    
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 404,
      message: "Can't get todos"
    })
  }
})

// Routes POST: /api/todos/completed/:todo_id
// desc : Mark todo completed
// access : Private
router.post('/completed/:todo_id', passport.authenticate('jwt',{session:false}), async(req, res) =>{
  try {
    const todo = await Todo.findById(req.params.todo_id)
    if(!todo) throw new Error
    todo.completed = true
    todo.completedAt = Date.now()
    const newTodo = await todo.save()
    return res.json({
      result: 'success',
      status: 200,
      message: 'Mark todo completed success',
      item: newTodo
    })
    
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      message: "Can't mark todo completed"
    })
  }
})
// Routes POST: /api/todos/uncompleted/:todo_id
// desc : Mark todo un completed
// access : Private
router.post('/uncompleted/:todo_id', passport.authenticate('jwt',{session:false}), async(req, res) =>{
  try {
    const todo = await Todo.findById(req.params.todo_id)
    if(!todo) throw new Error
    todo.completed = false
    delete todo.completedAt
    const newTodo = await todo.save()
    return res.json({
      result: 'success',
      status: 200,
      message: 'Mark todo uncompleted success',
      item: newTodo
    })
    
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      message: "Can't mark todo uncompleted"
    })
  }
})


module.exports = router