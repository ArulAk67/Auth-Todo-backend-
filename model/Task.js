import mongoose from "mongoose";


export const TodoSchema= new mongoose.Schema({
    text: {
       type:String,
       required:true
    },
    complete:{
        type:Boolean,
        default:false
    },
    timestamp:{
        type:String,
        default:Date.now()
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true,
    }
})

export default mongoose.model.Todo || mongoose.model('Todo', TodoSchema);


