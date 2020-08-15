const express = require("express")
const handlebars = require("express-handlebars")
const Handlebars = require("handlebars")
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const bodyParser = require("body-parser")
const app = express()

const admin = require("./routes/admin")
const usuarios = require("./routes/usuario")
const adminMaster = require("./routes/adminMaster")

const path = require("path")
const session = require("express-session")
const flash = require('connect-flash')
const passport = require ("passport")
require("./config/auth")(passport)

//--------MODELS
const Filme = require("./models/Filme")
const Produto = require("./models/Produto")
const Promocao = require("./models/Promocao")
const Compra = require("./models/Compra")
const Usuario = require("./models/Usuario")

//--------CONFIGURAÇÕES
//TEMPLATE ENGINE

app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
}))

app.set("view engine", "handlebars")

//BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//PUBLIC
app.use(express.static(path.join(__dirname, "public")))


//SESSION
app.use(session({
    secret: "kbVOsobiS7",
    resave: true,
    saveUnitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//MIDDLEWARE
app.use(async (req, res, next) => {
    res.locals.msgSuccess = req.flash("msgSuccess")
    res.locals.msgError = req.flash("msgError")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    res.locals.admin = false
    res.locals.headadmin = false

    if (res.locals.user != null) {
        if (res.locals.user.tipoUser == "Admin" || res.locals.user.tipoUser == "Master") {
            res.locals.admin = true
        }

        if (res.locals.user.tipoUser == "Master") {
            res.locals.headadmin = true
        }
    }

    next()
})

//--------ROTAS
app.get("/", (req, res) => {
    res.render("index")
})

app.get("/filmes", async (req, res) => {
    await Filme.findAll({ order: [["id", "DESC"]], where: { disponibilidade: "Em Cartaz" } }).then((EmCartaz) => {
        Filme.findAll({ order: [["id", "DESC"]], where: { disponibilidade: "Em Breve" } }).then((EmBreve) => {
            res.render("usuario/filme/indexFilme", { filmesEmCartaz: EmCartaz, filmesEmBreve: EmBreve })
        })
    })
})

app.get("/filme/:titulo", (req, res) => {
    Filme.findOne({where: {titulo: req.params.titulo}}).then((filme) => {
        if(filme){
            res.render("usuario/filme/index",{filme: filme})
        }else{
            req.flash("msgError", "Este filme não existe")
            res.redirect("/")
        }
    }).catch((erro) => {
        req.flash("msgError", "Houve um erro interno")
        res.redirect("/")
    })
})

app.get("/produtos", (req, res) => {
    Produto.findAll({ order: [["id", "DESC"]] }).then((produtos) => {
        res.render("usuario/produto/index", { produtos: produtos })
    }).catch((erro) => {
        req.flash("msgError", "Houve um erro interno")
        res.redirect("/")
    })
})
app.get("/produtos/:nome", (req, res) => {
    Produto.findOne({ where: { nome: req.params.nome } }).then((produto) => {
        res.render("usuario/produto/indexComp", { produto: produto })
    }).catch((err) => {
        req.flash("msgError", "Produto não existe")
        res.redirect("/produtos")
    }).catch((erro) => {
        req.flash("msgError", "Houve um erro interno")
        res.redirect("/")
    })
})

app.use("/admin", admin) //Grupo de rotas de ADMIN = admin.js
app.use("/usuarios", usuarios) //Grupo de rotas de usuario = usuarios.js
app.use("/adminMaster", adminMaster) //Grupo de rotas de usuario = adminMaster.js

//--------OUTROS
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor rodando na url localhost:8081")
})