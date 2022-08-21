// importando .env e nossa CONNECTIONSTRING
require('dotenv').config();

// importando express e mongoose
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// quando a promessa for resolvida ou rejeitada emitir o app.emit('pronto')
// ou emitir o error
mongoose.connect(
  process.env.CONNECTIONSTRING, {
    useNewURLParser: true,
    useUnifiedTopology: true
    }
  )
	.then(() => {
		app.emit('pronto');
	}).catch(error => console.log(error)
);

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const routes = require('./routes');
//resolvendo caminho absoluto do path
const path = require('path');
// importando o helmet
const helmet = require('helmet');
// importando CRSF
const csrf = require('csurf');
// importando o middleware
const { middlewareGlobal, checkCsrError, csrfMiddleware } = require('./src/middlewares/middleware');

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.5/dist/umd/popper.min.js',
          'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.min.js'
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css',
          'https://fonts.googleapis.com',
          'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css'
        ],
        imgSrc: [
          "'self'",
          'data:'
        ],
        connectSrc: ["'self'"],
        fontSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.gstatic.com',
          'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/fonts/bootstrap-icons.woff?8d200481aa7f02a2d63a331fc782cfaf',
          'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/fonts/bootstrap-icons.woff2?8d200481aa7f02a2d63a331fc782cfaf'
        ],
        objectSrc: ["'self'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"]
      },
    }
  })
);

app.use(express.urlencoded({ extended: true }));

//sinalizando para o express, que vamos recereber o formato json, em nossas requisições.
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')))

const sessionOptions = session({
  secret: 'secret',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});

app.use(sessionOptions);
app.use(flash());
// Caminho absoluto das views
app.set('views', path.resolve(__dirname, 'src', 'views'));
// 'view engine', 'ejs' é semenhante a um framework front end
app.set('view engine', 'ejs');

app.use(csrf());
// Todas as requisições e rotas vão pssar pelo middleware
app.use(middlewareGlobal);
app.use(checkCsrError);
app.use(csrfMiddleware);

// Importando routes.js
app.use(routes);

app.on('pronto', () => {
	app.listen(4000, () => {
		console.log('🟢 Servidor ON!');
	});
});
