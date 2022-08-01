//geralmente o model é uma class
//Schema é a modelagem dos dados

const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login(){
    this.valida();
    //cria meu user, se meu erros estiver vazio
    if(this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email });

    if(!this.user) {
      this.errors.push('Usuário não existe.');
      return;
    }

    if(!bcryptjs.compareSync(this.body.password, this.user.password)){
      this.errors.push('Senha inválida');
      this.user = null;
      return;
    }

  }

  async register() {
    this.valida();
    //cria meu user, se meu erros estiver vazio
    if(this.errors.length > 0) {
      return;
    }

    await this.userExists();

    //Verifica novamente se meu erros está vazio,
    //e caso não exista o user, ele cria.
    if(this.errors.length > 0) {
      return;
    }

    //convertendo senha em hash
    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt)

    this.user = await LoginModel.create(this.body);

  }

  // Caso exista o user, gera mensagem de error.
  async userExists(){
    this.user = await LoginModel.findOne({ email: this.body.email });
    if(this.user) {
      this.errors.push('Usuário já existe!');
    }
  };

  valida(){
    this.cleanUp();
    // Validação

    // O email precisa ser válido
    // se meu email não for válido faz um push no array de errors
    if(!validator.isEmail(this.body.email)){
      this.errors.push('Email inválido.');
    }
    // A senha precisa ter entre 6 e 50 caracters
    if(this.body.password.length < 6 || this.body.password.length > 50){
      this.errors.push('🥺 A senha precisa ter entre 6 e 50 caracteres.');
    }
  }
  cleanUp(){
    for(const key in this.body){
      if(typeof this.body[key] !== 'string'){
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password
    };
  }
}

module.exports = Login;
