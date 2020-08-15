const express = require("express")
const router = express.Router()
const { isAdminMaster } = require("../config/permissoes")

const Usuario = require("../models/Usuario")

router.get("/", isAdminMaster, async (req, res) => {
    await Usuario.findAll({ where: { tipoUser: "User" } }).then((users) => {
        Usuario.findAll({ where: { tipoUser: "Admin" } }).then((admins) => {
            res.render("admin/indexAdminMaster", { usuarios: users, admins: admins })
        })
    }).catch((error) => {
        req.flash("msgError", "Houve um erro interno ao carregar as contas")
    })
})

router.post("/up", isAdminMaster, (req, res) => {
    Usuario.update({
        tipoUser: "Admin"
    }, { where: { id: req.body.id } }).then(() => {
        req.flash("msgSuccess", "Usuario promovido com sucesso!")
        res.redirect("/adminMaster")
    }).catch((erro) => {
        req.flash("msgError", "Houve um erro ao atualizar o Usuario")
        res.redirect("/adminMaster")
    })
})

router.post("/down", isAdminMaster, (req, res) => {
    Usuario.update({
        tipoUser: "User"
    }, { where: { id: req.body.id } }).then(() => {
        req.flash("msgSuccess", "Usuario rebaixado com sucesso!")
        res.redirect("/adminMaster")
    }).catch((erro) => {
        req.flash("msgError", "Houve um erro ao atualizar o Usuario")
        res.redirect("/adminMaster")
    })
})

module.exports = router