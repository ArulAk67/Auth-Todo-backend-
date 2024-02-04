import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        required : [true, "Please provide unique Username"],
        unique: [true, "Username Exist"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique : false,
    },
    email: {
        type: String,
        required : [true, "Please provide a unique email"],
        unique: true,
    },
    fristName: { type: String},
    lastName: { type: String},
    mobile : { type : Number},
    profile: { type: String},
    
    todos: [{ type: mongoose.Types.ObjectId, ref: "Task" }],
});

export default mongoose.model.Users || mongoose.model('User', UserSchema);