const Usuario = require("../models/Usuario")

module.exports = {

    isUser: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("msgError", "Voc� precisa fazer login para acessar essa �rea")
        res.redirect("/")
    },

    isAdmin: function (req, res, next) {
        if (req.isAuthenticated() && (req.user.tipoUser == "Admin" || req.user.tipoUser == "Master")) {
            return next()
        }

        req.flash("msgError", "Voc� precisa fazer login como administrador para acessar essa �rea")
        res.redirect("/")
    },

    isAdminMaster: function (req, res, next) {
        if (req.isAuthenticated() && req.user.tipoUser == "Master") {
            return next()
        }

        req.flash("msgError", "Voc� precisa fazer login como administrador master para acessar essa �rea")
        res.redirect("/")
    }
}