import express from "express";
import mongoose from "mongoose";
import path from "path";
import { APP_PORT, DB_URL } from "./config";
import errorHandler from "./middlewares/errorHandler";
import routes from './routes';
const morgan = require('morgan');
const fs = require('fs');




const app = express();

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: false });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'console error:'));
db.once('open', () => {
  console.log("db connected")
})

// logging in file
// var accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' })
// app.use(morgan('combined', { stream: accessLogStream }))

//logging in console
app.use(morgan('combined'));




global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use('/api/v1', routes);

app.use('/uploads', express.static('uploads'))


//error handling
app.use(errorHandler)

app.listen(APP_PORT, () =>
  console.log(`listening on port ${APP_PORT}.`)
)