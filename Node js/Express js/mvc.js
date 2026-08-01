import express from 'express'
import { handleUsers } from './controllers/usersController.js';
const app = express();

app.set('view engine', 'ejs');

app.get('/users', handleUsers)


app.listen(3000);