const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
	res.render('contato', {
    contato: {},
  });
};

exports.register = async (req, res) => {

	try {
		const contato = new Contato(req.body);
		await contato.register();

		if(contato.errors.length > 0) {
			req.flash('errors', contato.errors);
			req.session.save(() => res.redirect('/contato'));
			return;
		};

		req.flash('success', 'Contato registrado com sucesso.');
		req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
		return;

	} catch (err) {
		console.log(err);
		return res.render('404');
	};
};


exports.editContatoIndex = async (req, res) => {
  //Se não conter id, redirecionar para tela de erro 404
  if(!req.params.id){
    return res.render('404');
  };

  const contato = await Contato.buscaPorId(req.params.id);

  // Se contato não existe, redirecionar para tela de erro 404
  if(!contato){
    return res.render('404');
  }

  // Se contato existe renderize o contato na tela de contato
  res.render('contato', {
    contato,
  });
}

exports.edit = async (req, res) => {
  try {
    //Se não conter id, redirecionar para tela de erro 404
    if(!req.params.id){
      return res.render('404');
    };

    const contato = new Contato(req.body);
    await contato.edit(req.params.id);

    if(contato.errors.length > 0) {
      req.flash('errors', contato.errors);
      req.session.save(() => res.redirect('/contato'));
      return;
    };

    req.flash('success', '📝 Contato editado com sucesso.');
    req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
    return;
  } catch (err) {
    console.log(err);
    return res.render('404');
  }
}

exports.delete = async (req, res) => {
  //Se não conter id, redirecionar para tela de erro 404
  if(!req.params.id){
    return res.render('404');
  };

  const contato = await Contato.delete(req.params.id);

  // Se contato não existe, redirecionar para tela de erro 404
  if(!contato){
    return res.render('404');
  }

  req.flash('success', '🗑️ Contato excluido com sucesso.');
  req.session.save(() => res.redirect('/'));
  return;
}
