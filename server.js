import express from "express";
import bcrypt from 'bcrypt-nodejs'
import cors from 'cors';
import knex from "knex";
import register from './controllers/register.js';
import singin from "./controllers/singin.js";
import profile from "./controllers/profile.js";
import image from "./controllers/image.js";

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : '1234',
      database : 'smart-brain'
    }
});

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {res.send('success')});
app.post('/signin', singin.handleSignin(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:id', profile.handleProfileGet(db));
app.put('/image', (req, res) => image.handleImage(req, res, db));
app.post('/imageUrl', (req, res) => image.handleApiCall(req, res));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`)
});
