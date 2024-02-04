import express from "express";
import { createResetSession, generateOTP, getUser, login, register, resetPassword, updateuser, verifyOTP, verifyUser } from "../controller/User-controller.js";
import { registerMail } from "../controller/mailer.js";

const Router= express.Router();

Router.post('/register',register); // register user
Router.post('/registerMail',registerMail); // send the email
Router.post('/authenticate',verifyUser); // authenticate user
Router.post('/login',login);

Router.get('/generateOTP',generateOTP); // generate random OTP
Router.get('/verifyOTP',verifyOTP); // verify generated OTP
Router.get('/createResetSession',createResetSession);// reset all the variables
Router.get('/:username',getUser); // user with username

Router.put('/updateuser',updateuser); // is use to update the user profile
Router.put('/resetPassword',resetPassword); // use to reset password

export default Router;