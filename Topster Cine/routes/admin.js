const express = require("express")
const router = express.Router()
const { isAdmin } = require("../config/permissoes")

//--------MODELS
const Filme = require("../models/Filme")
const Produto = require("../models/Produto")
const Promocao = require("../models//Promocao")
const Compra = require("../models/Compra")
const Sessao = require("../models/Sessao")
const Sala = require("../models/Sala")
const Poltrona = require("../models/Poltrona")

router.get("/", isAdmin, (req, res) => {
    res.render("admin/index")
})

//--------FILMES
var validationFilme = function (titulo, diretor, dataLancamento, sinopse, disponibilidade) {
    var erros = []

    if (!titulo || typeof titulo == undefined || !titulo == null) {
        erros.push({ text: "Nome inválido!" })
    }

    if (!diretor || typeof diretor == undefined || !diretor == null) {
        erros.push({ text: "Diretor inválido!" })
    }

    if (!dataLancamento || typeof dataLancamento == undefined || !dataLancamento == null) {
        erros.push({ text: "Data de Lançamento inválida!" })
    }

    if (!sinopse || typeof sinopse == undefined || !sinopse == null) {
        erros.push({ text: "Sinopse inválida!" })
    }

    if (!disponibilidade || typeof disponibilidade == undefined || !disponibilidade == null) {
        erros.push({ text: "Disponibilidade inválida!" })
    }

    return erros
}

router.get("/filme", isAdmin, (req, res) => {
    Filme.findAll({ order: [["id", "DESC"]] }).then((filmes) => {
        res.render('admin/filme/indexFilme', { filmes: filmes })
    })
})

//Insert
router.get("/filme/reg", isAdmin, (req, res) => {
    res.render("admin/filme/formFilme")
})

router.post("/filme/add", isAdmin, (req, res) => {

    var erros = validationFilme(req.body.titulo, req.body.diretor, req.body.dataLancamento, req.body.sinopse, req.body.disponibilidade)

    if (erros.length > 0) {
        res.render("admin/filme/formFilme", { erros: erros })
    } else {
        Filme.create({
            titulo: req.body.titulo,
            diretor: req.body.diretor,
            ano: req.body.dataLancamento,
            sinopse: req.body.sinopse,
            disponibilidade: req.body.disponibilidade
        }).then(() => {
            req.flash("msgSuccess", "Filme registrado com sucesso!")
            res.redirect("/admin/filme")
        }).catch((erro) => {
            req.flash("msgError", "Houve um erro ao registrar o filme, tente novamente!")
            res.send("Houve um erro:" + erro)
        })
    }
})

//Update
router.get("/filme/edit/:id", isAdmin, (req, res) => {
    Filme.findOne({ where: { id: req.params.id } }).then((filme) => {
        res.render("admin/filme/editarFilme", { filme: filme })
    }).catch((err) => {
        req.flash("msgError", "Filme não existe!")
        res.redirect("/admin/filme")
    })
})

router.post("/filme/update", isAdmin, (req, res) => {
    var erros = validationFilme(req.body.titulo, req.body.diretor, req.body.dataLancamento, req.body.sinopse, req.body.disponibilidade)

    if (erros.length > 0) {
        res.render("admin/filme/formFilme", { erros: erros })
    } else {
        Filme.update({
            titulo: req.body.titulo,
            diretor: req.body.diretor,
            ano: req.body.dataLancamento,
            sinopse: req.body.sinopse,
            disponibilidade: req.body.disponibilidade
        }, { where: { id: req.body.id } }).then(() => {
            req.flash("msgSuccess", "Filme atualizado com sucesso!")
            res.redirect("/admin/filme")
        }).catch((erro) => {
            req.flash("msgError", "Houve um erro ao atualizar o filme, tente novamente!")
            res.send("Houve um erro:" + erro)
        })
    }
})


//Delete
router.post("/filme/delete", isAdmin, (req, res) => {
    Filme.destroy({ where: { id: req.body.id } }).then(() => {
        req.flash("msgSuccess", "Filme deletado com sucesso!")
        res.redirect("/admin/filme")
    }).catch((erro) => {
        req.flash("msgError", "Houve um erro ao deletar o filme")
        res.redirect("/admin/filme")
    })
})

//--------PRODUTOS
var validationProd = function (nome, preco) {
    var erros = []

    if (!nome || typeof nome == undefined || !nome == null) {
        erros.push({ text: "Nome inválido!" })
    }

    if (!preco || typeof preco == undefined || !preco == null) {
        erros.push({ text: "Preco inválido!" })
    }

    return erros
}

router.get("/produto", isAdmin, (req, res) => {
    Produto.findAll({ order: [["id", "DESC"]] }).then((produtos) => {
        res.render("admin/produto/indexProd", { produtos: produtos })
    })
})

//Insert
router.get("/produto/reg", isAdmin, (req, res) => {
    res.render("admin/produto/formProd")
})

router.post("/produto/add", isAdmin, (req, res) => {
    var erros = validationProd(req.body.nome, req.body.preco)

    console.log(erros)

    if (erros.length > 0) {
        res.render("admin/produto/formProd", { erros: erros })
    } else {
        Produto.create({
            nome: req.body.nome,
            preco: parseFloat(req.body.preco),
        }).then(() => {
            req.flash("msgSuccess", "Produto registrado com sucesso!")
            res.redirect("/admin/produto")
        }).catch((erro) => {
            req.flash("msgError", "Não foi possível registrar o produto, tente novamente")
            res.redirect("/admin/produto")
        })
    }
})

//Update
router.get("/produto/edit/:id", isAdmin, (req, res) => {
    Produto.findOne({ where: { id: req.params.id } }).then((produto) => {
        res.render("admin/produto/editarProd", { produto: produto })
    }).catch((err) => {
        req.flash("msgError", "produto não existe!")
        res.redirect("/admin/produto")
    })
})

router.post("/produto/update", isAdmin, (req, res) => {
    var erros = validationProd(req.body.nome, req.body.preco)

    console.log(erros)

    if (erros.length > 0) {
        res.render("admin/produto/formProd", { erros: erros })
    } else {
        Produto.update({
            nome: req.body.nome,
            preco: parseFloat(req.body.preco),
        }, { where: { id: req.body.id } }).then(() => {
            req.flash("msgSuccess", "Produto atualizar com sucesso!")
            res.redirect("/admin/produto")
        }).catch((erro) => {
            req.flash("msgError", "Não foi possível atualizar o produto, tente novamente")
            res.redirect("/admin/produto")
        })
    }
})

//Delete
router.post("/produto/delete", isAdmin, (req, res) => {
    Produto.destroy({ where: { id: req.body.id } }).then(() => {
        req.flash("msgSuccess", "Produto deletado com sucesso!")
        res.redirect("/admin/produto")
    }).catch((erro) => {
        req.flash("msgError", "Houve um erro ao deletar o Produto")
        res.redirect("/admin/produto")
    })
})

//--------SESSOES
router.get("/sessoes", isAdmin, async (req, res) => {
    await Sessao.findAll().then((sessoes) => {
        res.render("admin/sessoes/indexSessoes", { sessoes: sessoes })
    })
})

router.get("/salas/reg", isAdmin, (req, res) => {
    res.render("admin/sessoes/formSala")
})

//Função para preencher poltronas
getPoltronas = (sala, capacidade) => {
    for (i = 1; i <= capacidade; i++) {
        Poltrona.create({
            nomePoltrona: i,
            salaId: sala
        })
    }
}

router.post("/salas/add", isAdmin, async (req, res) => {
    await Sala.create({
        nomeSala: req.body.nome,
        capacidade: req.body.capacidade,
    }).then(() => {
        req.flash("msgSuccess", "Sala registrada com sucesso!")
        res.redirect("/admin/sessoes")
    }).catch((erro) => {
        req.flash("msgError", "Não foi possível registrar a sala, tente novamente")
        res.redirect("/admin/sessoes")
    })

    Sala.findOne({ where :{ nomeSala: req.body.nome }}).then((sala) => {
        getPoltronas(sala.id, sala.capacidade)
    })
})

router.get("/sessoes/reg", isAdmin, async (req, res) => {
    await Sala.findAll().then((salas) => {
        Filme.findAll({ where: { disponibilidade: "Em Breve" } }).then((filmes) => {
            res.render("admin/sessoes/formSessoes", {salas: salas, filmes: filmes})
        }).catch((erro) => {
            req.flash("msgErro", "Houve um erro interno ao verificar os filmes")
            res.redirect("/")
        })
    }).catch((erro) => {
        req.flash("msgErro", "Houve um erro interno ao verificar as salas")
        res.redirect("/")
    })
})

router.post("/sessoes/add", isAdmin, async (req, res) => {
    dateTime = req.body.horario.replace(/T/g, " às ");

    Sessao.create({
        horario: req.body.horario,
        salaId: req.body.sala,
        filmeId: req.body.filme
    }).then(() => {
        Filme.update({
            disponibilidade: "Em Cartaz"
        }, { where: { id: req.body.filme } }).then(() => {
            req.flash("msgSuccess", "Sessao registrada com sucesso!")
            res.redirect("/admin/sessoes")
        }).catch((erro) => {
            req.flash("msgError", "Houve um erro ao atualizar o filme, tente novamente!")
            res.send("Houve um erro interno ao atualizar o filme")
        })
    }).catch((erro) => {
        req.flash("msgError", "Não foi possível registrar a sessao, tente novamente: " + erro)
        res.redirect("/admin/sessoes")
    })
})

module.exports = router