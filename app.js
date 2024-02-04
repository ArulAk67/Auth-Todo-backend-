
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Router from "./route/route.js";
import todoRouter from "./route/taskRoute.js";

dotenv.config();

const app = express();
 

app.use(express.json()); 
app.use(cors());

app.use("/user",Router);
app.use("/todo",todoRouter)


// mongoose.connect('mongodb://127.0.0.1:27017/Auth+Todo', {
//    useNewUrlParser: true,
//    useUnifiedTopology: true
//  })
// .then(() => {
//     app.listen(5500, () => {
//         console.log("Listening..");
//     });
// })
// .catch(error => {
//     console.error('Error connecting to MongoDB Atlas:', error);
// });
// // mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.uz49hgp.mongodb.net/?retryWrites=true&w=majority

mongoose
  .connect(
    `mongodb+srv://arulkumarak6677:${process.env.MONGODB_PASSWORD}@cluster0.ybfyxhb.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() =>
    app.listen(5500, () =>
      console.log("Connected To Database And Server is running")
    )
  )
  .catch((e) => console.log(e));

