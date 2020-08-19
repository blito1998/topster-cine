const express = require("express")
const router = express.Router()
const { isAdminMaster } = require("../config/permissoes")
const mongoose = require("mongoose")

//Models
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
require("../models/Sala")
const Sala = mongoose.model("salas")
require("../models/Poltrona")
const Poltrona = mongoose.model("poltronas")

router.get("/", isAdminMaster, async (req, res) => {
    await Usuario.find({ tipoUser: "User" }).then((users) => {
        Usuario.find({tipoUser: "Admin" }).then((admins) => {
            res.render("admin/indexAdminMaster", { usuarios: users, admins: admins })
        })
    }).catch((error) => {
        req.flash("msgError", "Houve um erro interno ao carregar as contas")
    })
})

router.post("/up", isAdminMaster, (req, res) => {
    Usuario.finOne({ _id: req.body.id }).then((usuario) => {
        usuario.tipoUser = "Admin"
        usuario.save().then(() => {
            req.flash("msgSuccess", "Usuario promovido com sucesso!")
            res.redirect("/adminMaster")
        }).catch((err) => {
            req.flash("msgError", "Houve um erro ao atualizar o Usuario")
            res.redirect("/adminMaster")
        })
    }).catch((err) => {
        req.flash("msgError", "Houve um erro ao buscar o Usuario")
        res.redirect("/adminMaster")
    })
})

router.post("/down", isAdminMaster, (req, res) => {
    Usuario.finOne({ _id: req.body.id }).then((usuario) => {
        usuario.tipoUser = "User"
        usuario.save().then(() => {
            req.flash("msgSuccess", "Usuario rebaixado com sucesso!")
            res.redirect("/adminMaster")
        }).catch((err) => {
            req.flash("msgError", "Houve um erro ao atualizar o Usuario")
            res.redirect("/adminMaster")
        })
    }).catch((err) => {
        req.flash("msgError", "Houve um erro ao buscar o Usuario")
        res.redirect("/adminMaster")
    })
})

router.get("/salas/reg", isAdminMaster, (req, res) => {
    res.render("admin/sessoes/formSala")
})

//Função para preencher poltronas
getPoltronas = (sala, capacidade) => {
    for (i = 1; i <= capacidade; i++) {
        var newPoltrona = {
            nomePoltrona: i,
            salaId: sala
        }

        new Poltrona(newPoltrona).save()
    }
}

router.post("/salas/add", isAdminMaster, async (req, res) => {

    var newSala = {
        nomeSala: req.body.nome,
        capacidade: req.body.capacidade
    }

    await new Sala(newSala).save().then(() => {
        req.flash("msgSuccess", "Sala registrada com sucesso!")
        res.redirect("/admin/sessoes")
    }).catch((erro) => {
        req.flash("msgError", "Não foi possível registrar a sala, tente novamente")
        res.redirect("/admin/sessoes")
    })

    Sala.findOne({ nomeSala: req.body.nome }).then((sala) => {
        getPoltronas(sala.id, sala.capacidade)
    })
})

module.exports = router