const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")
const { isAdmin } = require("../config/permissoes")
const mongoose = require("mongoose")

//Models
require("../models/Produto")
const Produto = mongoose.model("produtos")
require("../models/Promocao")
const Promocao = mongoose.model("promocoes")
require("../models/Sessao")
const Sessao = mongoose.model("sessoes")
require("../models/Filme")
const Filme = mongoose.model("filmes")
require("../models/Sala")
const Sala = mongoose.model("salas")

router.get("/", isAdmin, (req, res) => {
    res.render("admin/index")
})

//Route config
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

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
    Filme.find().then((filmes) => {
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
        const newFilme = {
            titulo: req.body.titulo,
            diretor: req.body.diretor,
            ano: req.body.dataLancamento,
            sinopse: req.body.sinopse,
            disponibilidade: req.body.disponibilidade
        }

        new Filme(newFilme).save().then(() => {
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
    Filme.findOne({ _id: req.params.id }).then((filme) => {
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
        Filme.findOne({ _id: req.body.id }).then((filme) => {
            filme.titulo = req.body.titulo
            filme.diretor = req.body.diretor
            filme.ano = req.body.dataLancamento
            filme.sinopse = req.body.sinopse
            filme.disponibilidade = req.body.disponibilidade

            filme.save().then(() => {
                req.flash("msgSuccess", "Filme atualizado com sucesso!")
                res.redirect("/admin/filme")
            }).catch((erro) => {
                req.flash("msgError", "Houve um erro ao atualizar o filme, tente novamente!")
                res.send("Houve um erro:" + erro)
            })
        })
    }
})

//Delete
router.post("/filme/delete", isAdmin, (req, res) => {
    Filme.remove({ _id: req.body.id }).then(() => {
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
    Produto.find().then((produtos) => {
        Promocao.find().populate("produtoID").then((promos) => {
            res.render("admin/produto/indexProd", { produtos: produtos, promocoes: promos })
        }).catch((err) => {
            req.flash("msgError", "Não foi possivel identificar as promoções, erro interno: " + err)
            req.redirect("/")
        })
    }).catch((err) => {
        req.flash("msgError", "Houve um erro interno ao carregar a pagina: " + err)
        req.redirect("/")
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
        const newProd = {
            nome: req.body.nome,
            preco: parseFloat(req.body.preco),
        }

        new Produto(newProd).save().then(() => {
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
    Produto.findOne({ _id: req.params.id }).then((produto) => {
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
        Produto.findOne({ _id: req.body.id }).then((produto) => {
            produto.nome = req.body.nome
            produto.preco = parseFloat(req.body.preco)

            produto.save().then(() => {
                req.flash("msgSuccess", "Produto atualizar com sucesso!")
                res.redirect("/admin/produto")
            }).catch((erro) => {
                req.flash("msgError", "Não foi possível atualizar o produto, tente novamente")
                res.redirect("/admin/produto")
            })
        })
    }
})

//Delete
router.post("/produto/delete", isAdmin, (req, res) => {
    Produto.remove({ _id: req.body.id }).then(() => {
        req.flash("msgSuccess", "Produto deletado com sucesso!")
        res.redirect("/admin/produto")
    }).catch((erro) => {
        req.flash("msgError", "Houve um erro ao deletar o Produto")
        res.redirect("/admin/produto")
    })
})

//--------PROMOÇÕES
var validationPromo = function (nome, preco) {
    var erros = []

    if (!nome || typeof nome == undefined || !nome == null) {
        erros.push({ text: "Nome inválido!" })
    }

    if (!preco || typeof preco == undefined || !preco == null) {
        erros.push({ text: "Preco inválido!" })
    }

    return erros
}

//Insert
router.get("/promo/reg", isAdmin, (req, res) => {
    Produto.find().then((produtos) => {
        res.render("admin/produto/formPromo", { produtos: produtos })
    }).catch((err) => {
        req.flash("msgError", "Houve um erro interno ao identificar os produtos")
        res.redirect("/admin/produto")
    })
})

router.post("/promo/add", isAdmin, (req, res) => {
    var erros = validationPromo(req.body.idPromo, req.body.preco)

    if (erros.length > 0) {
        res.render("admin/produto/formPromo", { erros: erros })
    } else {
        const newPromo = {
            promocao: req.body.idPromo,
            produtoID: req.body.idProd,
            preco: parseFloat(req.body.preco)
        }

        new Promocao(newPromo).save().then(() => {
            req.flash("msgSuccess", "Promoção registrado com sucesso!")
            res.redirect("/admin/produto")
        }).catch((erro) => {
            req.flash("msgError", "Não foi possível registrar a promoção, tente novamente" + erro)
            res.redirect("/admin/produto")
        })
    }
})

//Update
router.get("/promo/edit/:id", isAdmin, async (req, res) => {
    await Promocao.findOne({ _id: req.params.id }).then((promo) => {
        Produto.Find().then((prod) => {
            res.render("admin/produto/editarPromo", { promocao: promo, produtos: prod })
        })
    }).catch((err) => {
        req.flash("msgError", "produto não existe!")
        res.redirect("/admin/produto")
    })
})

router.post("/produto/update", isAdmin, (req, res) => {
    var erros = validationPromo(req.body.idPromo, req.body.preco)

    console.log(erros)

    if (erros.length > 0) {
        res.render("admin/produto/formPromo", { erros: erros })
    } else {
        Promocao.findOne({ _id: req.body.id }).then((promo) => {
            promo.promocao = req.body.idPromo
            promo.produtoID = req.body.idProd
            promo.preco = parseFloat(req.body.preco)

            promo.save().then(() => {
                req.flash("msgSuccess", "Promoção atualizada com sucesso!")
                res.redirect("/admin/produto")
            }).catch((erro) => {
                req.flash("msgError", "Não foi possível atualizar a promoção, tente novamente")
                res.redirect("/admin/produto")
            })
        })
    }
})

//Delete
router.post("/produto/delete", isAdmin, (req, res) => {
    Promocao.remove({ _id: req.body.id }).then(() => {
        req.flash("msgSuccess", "Promoção deletada com sucesso!")
        res.redirect("/admin/produto")
    }).catch((erro) => {
        req.flash("msgError", "Houve um erro ao deletar a Promoção")
        res.redirect("/admin/produto")
    })
})

//--------SESSOES
router.get("/sessoes", isAdmin, async (req, res) => {
    Sessao.find().populate("filmeID").populate("salaID").then((sessoes) => {
        res.render("admin/sessoes/indexSessoes", { sessoes: sessoes })
    })
})

router.get("/sessoes/reg", isAdmin, async (req, res) => {
    await Sala.find().then((salas) => {
        Filme.find({ disponibilidade: "Em Breve" }).then((filmes) => {
            res.render("admin/sessoes/formSessoes", { salas: salas, filmes: filmes })
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

    console.log(req.body)
    console.log(req.body.sala + " " + req.body.filme)

    if (!req.body.sala || !req.body.filme) {
        req.flash("msgErro", "Registro de sessão inválido, tente novamente. Verifique se as salas e filmes são válidos")
        res.redirect("/admin/sessoes")
    } else {
        dateTime = req.body.horario.replace(/T/g, " às ");
        var newSessao = {
            horario: dateTime,
            salaID: req.body.sala,
            filmeID: req.body.filme
        }

        new Sessao(newSessao).save().then(() => {
            Filme.findOne({ _id: req.body.filme }).then((filme) => {
                filme.disponibilidade = "Em Cartaz"

                filme.save().then(() => {
                    req.flash("msgSuccess", "Sessao registrada com sucesso!")
                    res.redirect("/admin/sessoes")
                }).catch((erro) => {
                    req.flash("msgError", "Houve um erro ao atualizar o filme, tente novamente!")
                    res.send("Houve um erro interno ao atualizar o filme")
                })
            })
        }).catch((erro) => {
            req.flash("msgError", "Não foi possível registrar a sessão, tente novamente: " + erro)
            res.redirect("/admin/sessoes")
        })
    }
})

router.post("/sessoes/unpublish", isAdmin, (req, res) => {

    Sessao.update({ _id: req.body.id }, { status: false }).then(() => {
        req.flash("msgSuccess", "Sessão removida com sucesso")
        res.redirect("/admin/sessoes")
    }).catch((err) => {
        req.flash("msgError", "Houve um erro ao atualizar o status da sessão")
        res.redirect("/admin/sessoes")
    })
})

router.post("/sessoes/publish", isAdmin, async (req, res) => {
    Sessao.update({ _id: req.body.id }, { status: true }).then(() => {
        req.flash("msgSuccess", "Sessão removida com sucesso")
        res.redirect("/admin/sessoes")
    }).catch((err) => {
        req.flash("msgError", "Houve um erro ao atualizar o status da sessão")
        res.redirect("/admin/sessoes")
    })
})


module.exports = router