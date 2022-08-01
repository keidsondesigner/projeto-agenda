exports.middlewareGlobal = (req, res, next) => {
  //Error messages
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  // session de login
  res.locals.user = req.session.user;
  next();
};

exports.checkCsrError = (err, req, res, next) => {
  if(err){
    return res.render('404')
  }
  next();
};

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
}
