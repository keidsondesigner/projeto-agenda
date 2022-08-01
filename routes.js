const express = require('express');
const routes = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');

//Rotas da Home
routes.get('/', homeController.index);

//Rotas de Login
routes.get('/login', loginController.index);
// Rota do form quando for Error ou Success
routes.post('/login/register', loginController.register);
routes.post('/login/login', loginController.login);
routes.get('/login/logout', loginController.logout);

module.exports = routes;
