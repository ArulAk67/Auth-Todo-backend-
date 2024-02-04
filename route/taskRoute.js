import express from "express";
import mongoose from "mongoose";
import Todo from "../model/Task.js";
import User from "../model/User.js";

const todoRouter= express.Router();

todoRouter.get('/',async(req,res)=>{
    // const todos= await Todo.find();

    // res.json(todos);
 const userId = req.headers.authorization;

  let todos;
  try {
    todos = await Todo.find({ user: new mongoose.Types.ObjectId(userId) });
  } catch (err) {
    return console.log(err);
  }
  if (!todos) {
    return res.status(500).json({ message: "Unexpected Error" });
  }
  return res.status(200).json({todos});
})
  
todoRouter.post('/new', async(req,res)=>{
//   const todo= new TodoSchema({
//     text: req.body.text
//   });
//   todo.save();
//   res.json(todo);

      const { text, user } = req.body;
    
      let existingUser;
      try{
        existingUser = await User.findById(new mongoose.Types.ObjectId(user));
      }catch(err)
      {
        return console.log(err);
      }
      if(!existingUser){
        return res.status(404).json({ message: "User not found with given id" });
      }

      let todo;
      try{
        todo= new Todo({
            text,
            user,
        });

        const session =await mongoose.startSession();
        session.startTransaction();
        existingUser.todos.push(todo);
        await existingUser.save({session});
        await todo.save({session});
        session.commitTransaction();

      }catch(err){
        return console.log(err)
      }

      if (!todo) {
        return res.status(500).json({ message: "Unable to create a task" });
      }
      return res.status(200).json({ todo });
})

  todoRouter.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const todo = await Todo.findByIdAndRemove(id).populate('user');
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        
        // Extracting the user from the todo before deleting it
        const user = todo.user;

        const session = await mongoose.startSession();
        session.startTransaction();
        await todo.user.todos.pull(todo);
        await todo.user.save({ session });
        await session.commitTransaction();

        // Now you can safely use the user object
        console.log("Deleted Todo's User:", user);

        return res.status(200).json({ message: "Successfully Deleted" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Unable to Delete" });
    }
});


todoRouter.get('/complete/:id', async(req,res)=>{
//   const todo=await Todo.findById({_id: new mongoose.Types.ObjectId(req.params.id)});

//   todo.complete = !todo.complete;

//   todo.save();

//   res.json(todo);
const id = new mongoose.Types.ObjectId(req.params.id);
  let todo;
  try {
    todo = await Todo.findById(id);
    if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
    }
    console.log(todo);
    todo.complete = !todo.complete;
    await todo.save();

  } catch (err) {
    return console.log(err);
  }
  return res.status(200).json(todo);
})

 export default todoRouter;


