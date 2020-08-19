const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
const mongoose = require ("mongoose")


//MODEL de usuário
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

//Sistema de autenticação
module.exports = function(passport){
    passport.use(new localStrategy({ usernameField: "email", passwordField: "senha" }, (email, senha, done) => {
        Usuario.findOne({ email: email } ).then((usuario) => {
            if(!usuario){
                return done (null, false, {message: "Esta conta não existe"})
            }
            if(usuario.verificado == 0){
                return done (null, false, {message: "Está conta não foi verificada, favor olhar no seu e-mail o pedido de verificação"})
            }
            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
            
        })
    }))

    passport.serializeUser((usuario, done) =>{
        done(null, usuario)
    })

    passport.deserializeUser((usuario, done) => {
        done(null, usuario)
    })
}