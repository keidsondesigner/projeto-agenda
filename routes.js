const express = require('express');
const routes = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');

// loginRequired páginas que eu não quero que esteje acessesível
// se não estiver logado
const { loginRequired } = require('./src/middlewares/middleware');

//Rotas da Home
routes.get('/', homeController.index);

//Rotas de Login
routes.get('/login', loginController.index);

// Rota do form quando for Error ou Success
routes.post('/login/register', loginController.register);
routes.post('/login/login', loginController.login);
routes.get('/login/logout', loginController.logout);

// Rotas de contato
routes.get('/contato', loginRequired, contatoController.index);
routes.post('/contato/register', loginRequired, contatoController.register);
routes.get('/contato/index/:id', loginRequired, contatoController.editContatoIndex);
routes.post('/contato/edit/:id', loginRequired, contatoController.edit);
routes.get('/contato/delete/:id', loginRequired, contatoController.delete);


module.exports = routes;
