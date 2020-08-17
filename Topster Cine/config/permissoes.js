const Usuario = require("../models/Usuario")

module.exports = {

    isUser: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("msgError", "Você precisa fazer login para acessar essa área")
        res.redirect("/")
    },

    isAdmin: function (req, res, next) {
        if (req.isAuthenticated() && (req.user.tipoUser == "Admin" || req.user.tipoUser == "Master")) {
            return next()
        }

        req.flash("msgError", "Você precisa fazer login como administrador para acessar essa área")
        res.redirect("/")
    },

    isAdminMaster: function (req, res, next) {
        if (req.isAuthenticated() && req.user.tipoUser == "Master") {
            return next()
        }

        req.flash("msgError", "Você precisa fazer login como administrador master para acessar essa área")
        res.redirect("/")
    }
}