const db = require("./db")

const Produto = db.connection.define("produtos", {
    nome: {
        type: db.Sequelize.STRING
    },
    preco: {
        type: db.Sequelize.FLOAT
    }
})

Produto.sync()

module.exports = Produto