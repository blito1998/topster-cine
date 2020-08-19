const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require("passport")
const { isUser } = require("../config/permissoes")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")

//Models
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

//Configuração do nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth:{
        user: "semanadebaixas@gmail.com",
        pass:"1cartoriobaixas",
    }
})


//Cadastro
router.get("/registro", (req, res) => {
    res.render("usuario/registro")
})
//Validação
router.post("/registro", (req , res) => {
    
    var erros = []
    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({ texto: "Nome inválido"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({ texto: "Email inválido"})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({ texto: "Senha inválida"})
    }

    if(req.body.senha.length < 4){
        erros.push({texto: "Senha muito curta"})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: "Senhas diferentes, tente novamente"})
    }
    if(erros.length > 0){
        res.render("usuario/registro", { erros: erros} )
    }else{
        Usuario.findOne({email: req.body.email}).then((usuario) =>{
            if(usuario){
                req.flash("msgError", "Já foi registrada uma conta utilizando esse Email!")
                res.redirect("/usuarios/registro")
            }else{
                var novoUsuario = {
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                }
                bcrypt.genSalt(10,(erro,salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro){
                            req.flash("msgError", "Houve um erro durante o salvamento")
                            res.redirect("/")
                        }

                        novoUsuario.senha = hash

                        new Usuario(novoUsuario).save().then(()=>{
                            req.flash("msgSuccess", "Usuário criado com sucesso, foi enviado um email para sua conta, verifique sua conta para acessar o site!")
                            transporter.sendMail({
                                from: "TopterCine <semanadebaixas@gmail.com",
                                to: req.body.email,
                                subject:"Autenticação do email",
                                html:"<a href='http://localhost:8081/usuarios/verificado/"+req.body.email+"'>Clique aqui</a> para verificar"
                            }) 
                            res.redirect("/")
                        }).catch((err) =>{
                            req.flash("msgError", "Houve um erro durante o salvamento do usuário")
                            res.redirect("/usuarios/registro")
                        })

                    })
                })

            }
        }).catch((erro)=>{
            req.flash("msgError", "Houve um erro interno")
            res.redirect("/")
        })
    }
})
router.get("/verificado/:email", (req, res) => {
    Usuario.findOne({ email: req.params.email }).then((usuario) => {
        usuario.verificado = 1

        usuario.save().then(() => {
            req.flash("msgSuccess", "Conta verificada com sucesso, seu login está atualizado")
            res.redirect("/usuarios/login")
        })
    })
})

router.get("/editSenha", (req,res) =>{
        res.render("usuario/recuperar")     
})

router.post("/editSenha", (req, res) =>{
    Usuario.findOne({ email: req.body.email }).then((usuario) => {
        if(!usuario){
            req.flash("msgError","Email não registrado, crie sua conta")
            res.redirect("/usuarios/registro")
        }else{
            req.flash("msgSuccess","Solicitação de nova senha enviada")
            transporter.sendMail({
                from: "TopterCine <semanadebaixas@gmail.com",
                to: req.body.email,
                subject:"Recuperação de conta",
                html:"<a href='http://localhost:8081/usuarios/novaSenha/"+req.body.email+"'>Clique aqui</a> para alterar a senha"
            }) 
            res.redirect("/usuarios/login")
        }
    })    
})

router.get("/novaSenha/:email", (req,res) =>{
    Usuario.findOne({email: req.params.email}).then((usuario) =>{
            res.render("usuario/novaSenha",{usuario: usuario})
    })
})
router.post("/novaSenha/:email", (req,res)=>{
    var erros = []
    if(req.body.senha.length < 4){
        erros.push({texto: "Senha muito curta"})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: "Senhas diferentes, tente novamente"})
    }
    if(erros.length > 0){
        Usuario.findOne({email: req.params.email}).then((usuario) =>{
            res.render("usuario/novaSenha",{
                erros: erros,
                usuario: usuario})  
        })
    } else {
        Usuario.findOne({ email: req.params.email }).then((usuario) => {
            bcrypt.genSalt(10, (erro, salt) => {
                bcrypt.hash(usuario.senha, salt, (erro, hash) => {
                    if (erro) {
                        req.flash("msgError", "Houve um erro durante o salvamento")
                        res.redirect("/")
                    }

                    usuario.senha = hash

                    usuario.save().then(() => {
                        req.flash("msgSuccess", "Senha alterada com sucesso!")
                        res.redirect("/usuarios/login")
                    })
                })
            })
            req.flash("msgSuccess", "Senha alterada com sucesso!")
            res.redirect("/usuarios/login")
        })
    }    
})

router.get("/login", (req, res) => {
    res.render("usuario/login")
})

router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
}), (req, res) => {
        res.redirect('/')
    }
)

router.get("/logout", (req, res) => {
    req.logout()
    req.flash("msgSuccess", "Deslogado com sucesso!")
    res.redirect("/")
})

module.exports = router